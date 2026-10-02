package com.vistraa.ecommerce.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class OrderDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String userEmail;
        private Long userId;
        private String shippingAddress;
        private BigDecimal totalAmount;
        private List<ItemRequest> items;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemRequest {
        private String productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private String customSentiment;
        private String palette;
        private String printPatternUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemResponse {
        private Long id;
        private String productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private String customSentiment;
        private String palette;
        private String printPatternUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String orderId;
        private String transactionOrderId;
        private String userEmail;
        private String status;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private List<ItemRequest> items;
        private List<ItemResponse> itemResponses;
    }
}