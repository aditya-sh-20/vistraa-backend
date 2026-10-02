package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.VendorFulfillmentPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class VendorWebhookService {

    private static final Logger logger = LoggerFactory.getLogger(VendorWebhookService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${vistraa.fulfillment.webhook-url:http://localhost:8080/api/v1/mock-vendor/fulfill}")
    private String vendorWebhookUrl;

    @Async
    public void dispatchBlindFulfillment(VendorFulfillmentPayload payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Vistraa-Merchant-ID", "VISTRAA-BLIND-SHIPPER-01");

            HttpEntity<VendorFulfillmentPayload> requestEntity = new HttpEntity<>(payload, headers);

            logger.info(" Emitting async white-label fulfillment webhook for Order: {}",
                    payload.getFulfillmentOrderId());
            ResponseEntity<String> response = restTemplate.postForEntity(vendorWebhookUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info(" Fulfillment webhook delivered successfully. Response: {}", response.getBody());
            } else {
                logger.warn(" Vendor API returned non-2xx status: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error(" Failed to dispatch fulfillment webhook for Order {}: {}", payload.getFulfillmentOrderId(),
                    e.getMessage());
        }
    }
}