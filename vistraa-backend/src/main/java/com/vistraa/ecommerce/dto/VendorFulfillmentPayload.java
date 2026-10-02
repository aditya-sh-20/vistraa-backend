package com.vistraa.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorFulfillmentPayload {
    private String merchantBrand;
    private String fulfillmentOrderId;
    private String customerEmail;
    private String shippingAddress;
    private BigDecimal orderTotal;
    private List<FulfillmentItem> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FulfillmentItem {
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private GarmentSpec garmentSpec;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GarmentSpec {
        private String customSentiment;
        private String palette;
        private String printPatternUrl;
    }
}