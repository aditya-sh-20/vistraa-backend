package com.vistraa.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fabric")
public class AiFabricController {

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateFabricPattern(@RequestBody Map<String, Object> request) {
        String textPrompt = (String) request.get("text_prompt");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("prompt", textPrompt);
        response.put("pattern_url", "http://localhost:8000/static/patterns/pattern_generated.png");
        response.put("sentiment", "POSITIVE");

        return ResponseEntity.ok(response);
    }
}