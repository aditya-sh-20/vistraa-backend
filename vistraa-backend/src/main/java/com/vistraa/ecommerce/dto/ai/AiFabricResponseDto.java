package com.vistraa.ecommerce.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class AiFabricResponseDto {

    private SentimentData sentiment;
    private PatternData pattern;

    @Data
    public static class SentimentData {
        private String text;
        private String label;
        private Double score;

        @JsonProperty("positive_score")
        private Double positiveScore;

        @JsonProperty("negative_score")
        private Double negativeScore;

        private Double intensity;
    }

    @Data
    public static class PatternData {
        @JsonProperty("file_path")
        private String filePath;

        @JsonProperty("base64_png")
        private String base64Png;

        private String resolution;

        @JsonProperty("palette_mapped")
        private Map<String, Object> paletteMapped;
    }
}