package com.vistraa.ecommerce.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AiFabricRequestDto {

    @JsonProperty("text_prompt")
    private String textPrompt;

    public AiFabricRequestDto() {
    }

    public AiFabricRequestDto(String textPrompt) {
        this.textPrompt = textPrompt;
    }

    public String getTextPrompt() {
        return textPrompt;
    }

    public void setTextPrompt(String textPrompt) {
        this.textPrompt = textPrompt;
    }
}