package com.vistraa.ecommerce.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiFabricRequestDto {

    @JsonProperty("text_prompt")
    private String textPrompt;
}