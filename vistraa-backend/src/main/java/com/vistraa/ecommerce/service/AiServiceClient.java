package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.ai.AiFabricRequestDto;
import com.vistraa.ecommerce.dto.ai.AiFabricResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceBaseUrl;

    public AiServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    public AiFabricResponseDto generateFabricPattern(AiFabricRequestDto requestDto) {
        String targetEndpoint = aiServiceBaseUrl + "/api/v1/pattern/generate";
        return restTemplate.postForObject(targetEndpoint, requestDto, AiFabricResponseDto.class);
    }
}