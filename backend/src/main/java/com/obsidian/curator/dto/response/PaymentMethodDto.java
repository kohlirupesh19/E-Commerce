package com.obsidian.curator.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PaymentMethodDto {
    private UUID id;
    private String cardHolderName;
    private String maskedCardNumber;
    private String expiryDate;
    private Boolean isDefault;
}
