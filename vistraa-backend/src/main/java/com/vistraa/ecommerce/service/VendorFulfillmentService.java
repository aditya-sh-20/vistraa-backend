package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.VendorWebhookPayload;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.logging.Logger;

@Service
public class VendorFulfillmentService {

    private static final Logger LOGGER = Logger.getLogger(VendorFulfillmentService.class.getName());
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String VENDOR_WEBHOOK_URL = "http://localhost:8082/api/v1/mock-vendor/fulfillment";

    public boolean dispatchOrderToVendor(VendorWebhookPayload payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Vistraa-Signature", "VST-SECURE-WEBHOOK-AUTH-KEY");

            HttpEntity<VendorWebhookPayload> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(VENDOR_WEBHOOK_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                LOGGER.info("Order #" + payload.getOrderId() + " successfully dispatched to vendor webhook.");
                return true;
            }
        } catch (Exception e) {
            LOGGER.severe("Error triggering vendor fulfillment webhook: " + e.getMessage());
        }
        return false;
    }
}