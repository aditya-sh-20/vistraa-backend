package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.PaymentRequest;
import com.vistraa.ecommerce.dto.PaymentResponse;
import com.vistraa.ecommerce.dto.WebhookRequest;
import com.vistraa.ecommerce.model.Order;
import com.vistraa.ecommerce.model.User;
import com.vistraa.ecommerce.repository.OrderRepository;
import com.vistraa.ecommerce.repository.UserRepository;
import com.vistraa.ecommerce.security.PaymentSignatureUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id:rzp_test_vistraaKey123}")
    private String razorpayKeyId;

    @Value("${razorpay.webhook.secret:vistraa_webhook_secret_key_2026}")
    private String webhookSecret;

    public PaymentService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public PaymentResponse createOrder(PaymentRequest request) {
        String generatedOrderId = "order_vstr_" + UUID.randomUUID().toString().substring(0, 8);

        User user = null;
        if (request.getUserEmail() != null) {
            Optional<User> optionalUser = userRepository.findByEmail(request.getUserEmail());
            if (optionalUser.isPresent()) {
                user = optionalUser.get();
            }
        }

        Order order = Order.builder()
                .transactionOrderId(generatedOrderId)
                .user(user)
                .totalAmount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .status("PENDING")
                .build();

        orderRepository.save(order);

        return new PaymentResponse(
                generatedOrderId,
                request.getAmount().doubleValue(),
                order.getCurrency(),
                razorpayKeyId);
    }

    @Transactional
    public boolean processWebhook(String rawPayload, String signature, WebhookRequest request) {
        if (signature != null && !PaymentSignatureUtil.verifySignature(rawPayload, signature, webhookSecret)) {
            return false;
        }

        Optional<Order> orderOpt = orderRepository.findByTransactionOrderId(request.getTransactionOrderId());
        if (orderOpt.isEmpty()) {
            return false;
        }

        Order order = orderOpt.get();
        order.setPaymentId(request.getPaymentId());
        order.setStatus(request.getStatus() != null ? request.getStatus().toUpperCase() : "COMPLETED");
        orderRepository.save(order);

        return true;
    }
}