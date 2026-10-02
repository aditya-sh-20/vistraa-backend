package com.vistraa.ecommerce.controller;

import com.vistraa.ecommerce.dto.VendorFulfillmentPayload;
import com.vistraa.ecommerce.dto.order.OrderDto;
import com.vistraa.ecommerce.service.OrderService;
import com.vistraa.ecommerce.service.VendorWebhookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private VendorWebhookService vendorWebhookService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto.Response> processCheckout(@RequestBody OrderDto.CreateRequest request) {
        OrderDto.Response response = orderService.createOrder(request);

        List<VendorFulfillmentPayload.FulfillmentItem> vendorItems = request.getItems().stream()
                .map(item -> VendorFulfillmentPayload.FulfillmentItem.builder()
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .garmentSpec(VendorFulfillmentPayload.GarmentSpec.builder()
                                .customSentiment(item.getCustomSentiment())
                                .palette(item.getPalette())
                                .printPatternUrl(item.getPrintPatternUrl())
                                .build())
                        .build())
                .collect(Collectors.toList());

        VendorFulfillmentPayload fulfillmentPayload = VendorFulfillmentPayload.builder()
                .merchantBrand("Vistraa Apparel Co.")
                .fulfillmentOrderId(response.getTransactionOrderId())
                .customerEmail(response.getUserEmail())
                .shippingAddress(response.getShippingAddress())
                .orderTotal(response.getTotalAmount())
                .items(vendorItems)
                .build();

        vendorWebhookService.dispatchBlindFulfillment(fulfillmentPayload);

        return ResponseEntity.ok(response);
    }
}