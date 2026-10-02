package com.vistraa.ecommerce.controller;

import com.vistraa.ecommerce.dto.VendorWebhookPayload;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mock-vendor")
@CrossOrigin(origins = "*")
public class VendorMockController {

    @PostMapping("/fulfillment")
    public ResponseEntity<Map<String, Object>> receiveFulfillmentOrder(
            @RequestHeader(value = "X-Vistraa-Signature", required = false) String signature,
            @RequestBody VendorWebhookPayload payload) {

        System.out.println("==========================================");
        System.out.println("   BLIND VENDOR FULFILLMENT WEBHOOK RECEIVED   ");
        System.out.println("==========================================");
        System.out.println("Order ID        : " + payload.getOrderId());
        System.out.println("Customer        : " + payload.getCustomerName());
        System.out.println("Address         : " + payload.getShippingAddress());
        System.out.println("Fabric Pattern  : " + payload.getGeneratedPatternUrl());
        System.out.println("Garment/Size    : " + payload.getGarmentType() + " (" + payload.getSize() + ")");
        System.out.println("==========================================");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "RECEIVED");
        response.put("fulfillment_id", "VND-FULFILL-" + System.currentTimeMillis());
        response.put("message", "Order accepted for custom printing and blind-shipping.");

        return ResponseEntity.ok(response);
    }
}