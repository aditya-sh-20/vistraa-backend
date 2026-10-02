package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.VendorWebhookPayload;
import com.vistraa.ecommerce.dto.order.OrderDto;
import com.vistraa.ecommerce.model.Order;
import com.vistraa.ecommerce.model.OrderItem;
import com.vistraa.ecommerce.model.User;
import com.vistraa.ecommerce.repository.OrderRepository;
import com.vistraa.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private VendorFulfillmentService vendorFulfillmentService;

        @Transactional
        public OrderDto.Response createOrder(OrderDto.CreateRequest request) {
                User user = null;
                if (request.getUserId() != null) {
                        user = userRepository.findById(request.getUserId()).orElse(null);
                } else if (request.getUserEmail() != null) {
                        user = userRepository.findByEmail(request.getUserEmail()).orElse(null);
                }

                String txnId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

                Order order = Order.builder()
                                .user(user)
                                .shippingAddress(request.getShippingAddress())
                                .totalAmount(request.getTotalAmount())
                                .status("PAID")
                                .transactionOrderId(txnId)
                                .build();

                if (request.getItems() != null) {
                        List<OrderItem> items = request.getItems().stream().map(itemDto -> OrderItem.builder()
                                        .order(order)
                                        .productName(itemDto.getProductName())
                                        .quantity(itemDto.getQuantity())
                                        .price(itemDto.getPrice())
                                        .customSentiment(itemDto.getCustomSentiment())
                                        .palette(itemDto.getPalette())
                                        .printPatternUrl(itemDto.getPrintPatternUrl())
                                        .build()).collect(Collectors.toList());
                        order.setItems(items);
                }

                Order savedOrder = orderRepository.save(order);

                // -----------------------------------------------------------------
                // AUTOMATED BLIND-VENDOR FULFILLMENT DISPATCH (DAY 30 INTEGRATION)
                // -----------------------------------------------------------------
                String garmentType = "Custom AI Apparel";
                String size = "M";
                String patternUrl = "http://localhost:8000/static/patterns/pattern_generated.png";
                List<String> palette = Arrays.asList("#FF5733", "#FFC300");

                if (savedOrder.getItems() != null && !savedOrder.getItems().isEmpty()) {
                        OrderItem firstItem = savedOrder.getItems().get(0);
                        if (firstItem.getProductName() != null)
                                garmentType = firstItem.getProductName();
                        if (firstItem.getPrintPatternUrl() != null)
                                patternUrl = firstItem.getPrintPatternUrl();
                        if (firstItem.getPalette() != null && !firstItem.getPalette().isEmpty())
                                palette = firstItem.getPalette();
                }

                String customerName = (user != null && user.getEmail() != null) ? user.getEmail()
                                : (request.getUserEmail() != null ? request.getUserEmail() : "Vistraa Customer");

                VendorWebhookPayload webhookPayload = new VendorWebhookPayload(
                                savedOrder.getTransactionOrderId(),
                                customerName,
                                savedOrder.getShippingAddress() != null ? savedOrder.getShippingAddress()
                                                : "Primary Address",
                                garmentType,
                                size,
                                patternUrl,
                                palette,
                                savedOrder.getTotalAmount());

                boolean isDispatched = vendorFulfillmentService.dispatchOrderToVendor(webhookPayload);
                if (isDispatched) {
                        savedOrder.setStatus("DISPATCHED_TO_VENDOR");
                        savedOrder = orderRepository.save(savedOrder);
                }
                // -----------------------------------------------------------------

                List<OrderDto.ItemResponse> itemResponses = new ArrayList<>();
                if (savedOrder.getItems() != null) {
                        itemResponses = savedOrder.getItems().stream().map(item -> OrderDto.ItemResponse.builder()
                                        .id(item.getId())
                                        .productName(item.getProductName())
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .customSentiment(item.getCustomSentiment())
                                        .palette(item.getPalette())
                                        .printPatternUrl(item.getPrintPatternUrl())
                                        .build()).collect(Collectors.toList());
                }

                return OrderDto.Response.builder()
                                .id(savedOrder.getId())
                                .orderId(savedOrder.getTransactionOrderId())
                                .transactionOrderId(savedOrder.getTransactionOrderId())
                                .userEmail(user != null ? user.getEmail() : request.getUserEmail())
                                .status(savedOrder.getStatus())
                                .totalAmount(savedOrder.getTotalAmount())
                                .shippingAddress(savedOrder.getShippingAddress())
                                .items(request.getItems())
                                .itemResponses(itemResponses)
                                .build();
        }
}