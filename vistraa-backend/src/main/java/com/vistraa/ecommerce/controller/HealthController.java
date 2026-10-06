package com.vistraa.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "vistraa-backend");
        response.put("timestamp", System.currentTimeMillis());
        response.put("environment", "production");
        return ResponseEntity.ok(response);
    }
}
