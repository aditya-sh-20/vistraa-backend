package com.vistraa.ecommerce.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AiFabricResponseDto {

    @JsonProperty("sentiment_label")
    private String sentimentLabel;

    @JsonProperty("sentiment_score")
    private double sentimentScore;

    @JsonProperty("generated_prompt")
    private String generatedPrompt;

    @JsonProperty("pattern_url")
    private String patternUrl;

    @JsonProperty("color_palette")
    private List<String> colorPalette;

    public AiFabricResponseDto() {
    }

    public String getSentimentLabel() {
        return sentimentLabel;
    }

    public void setSentimentLabel(String sentimentLabel) {
        this.sentimentLabel = sentimentLabel;
    }

    public double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public String getGeneratedPrompt() {
        return generatedPrompt;
    }

    public void setGeneratedPrompt(String generatedPrompt) {
        this.generatedPrompt = generatedPrompt;
    }

    public String getPatternUrl() {
        return patternUrl;
    }

    public void setPatternUrl(String patternUrl) {
        this.patternUrl = patternUrl;
    }

    public List<String> getColorPalette() {
        return colorPalette;
    }

    public void setColorPalette(List<String> colorPalette) {
        this.colorPalette = colorPalette;
    }
}