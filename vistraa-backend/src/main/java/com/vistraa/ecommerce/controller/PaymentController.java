package com.vistraa.ecommerce.controller;

import com.vistraa.ecommerce.dto.PaymentRequest;
import com.vistraa.ecommerce.dto.PaymentResponse;
import com.vistraa.ecommerce.dto.WebhookRequest;
import com.vistraa.ecommerce.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createPaymentOrder(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestBody WebhookRequest webhookRequest) {

        boolean isProcessed = paymentService.processWebhook(webhookRequest.toString(), signature, webhookRequest);
        if (isProcessed) {
            return ResponseEntity.ok("Order payment status updated successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to process webhook: Invalid order or signature.");
    }
}