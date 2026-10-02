package com.vistraa.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

public class VendorWebhookPayload {
    private String orderId;
    private String customerName;
    private String shippingAddress;
    private String garmentType;
    private String size;
    private String generatedPatternUrl;
    private List<String> colorPalette;
    private BigDecimal amountPaid;

    public VendorWebhookPayload() {
    }

    public VendorWebhookPayload(String orderId, String customerName, String shippingAddress,
            String garmentType, String size, String generatedPatternUrl,
            List<String> colorPalette, BigDecimal amountPaid) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.shippingAddress = shippingAddress;
        this.garmentType = garmentType;
        this.size = size;
        this.generatedPatternUrl = generatedPatternUrl;
        this.colorPalette = colorPalette;
        this.amountPaid = amountPaid;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getGarmentType() {
        return garmentType;
    }

    public void setGarmentType(String garmentType) {
        this.garmentType = garmentType;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getGeneratedPatternUrl() {
        return generatedPatternUrl;
    }

    public void setGeneratedPatternUrl(String generatedPatternUrl) {
        this.generatedPatternUrl = generatedPatternUrl;
    }

    public List<String> getColorPalette() {
        return colorPalette;
    }

    public void setColorPalette(List<String> colorPalette) {
        this.colorPalette = colorPalette;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }
}