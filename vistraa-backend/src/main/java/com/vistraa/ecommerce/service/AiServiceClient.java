package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.ai.AiFabricRequestDto;
import com.vistraa.ecommerce.dto.ai.AiFabricResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AiServiceClient {

    private final WebClient aiServiceWebClient;

    public AiServiceClient(WebClient aiServiceWebClient) {
        this.aiServiceWebClient = aiServiceWebClient;
    }

    public Mono<AiFabricResponseDto> generateFabricPattern(String promptText) {
        AiFabricRequestDto request = new AiFabricRequestDto(promptText);

        return aiServiceWebClient.post()
                .uri("/ai/generate-fabric")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiFabricResponseDto.class);
    }
}