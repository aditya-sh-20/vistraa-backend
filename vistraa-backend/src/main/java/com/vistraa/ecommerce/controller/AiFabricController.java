package com.vistraa.ecommerce.controller;

import com.vistraa.ecommerce.dto.ai.AiFabricRequestDto;
import com.vistraa.ecommerce.dto.ai.AiFabricResponseDto;
import com.vistraa.ecommerce.service.AiServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/fabric")
@CrossOrigin(origins = "*")
public class AiFabricController {

    private final AiServiceClient aiServiceClient;

    public AiFabricController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @PostMapping("/generate")
    public ResponseEntity<AiFabricResponseDto> generateFabric(@RequestBody AiFabricRequestDto request) {
        AiFabricResponseDto response = aiServiceClient.generateFabricPattern(request);
        return ResponseEntity.ok(response);
    }
}