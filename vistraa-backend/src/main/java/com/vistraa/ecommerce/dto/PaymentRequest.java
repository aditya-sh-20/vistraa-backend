package com.vistraa.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String userEmail;
    private BigDecimal amount;
    private String currency;
    private String sentiment;
    private String size;
    private List<String> palette;
}