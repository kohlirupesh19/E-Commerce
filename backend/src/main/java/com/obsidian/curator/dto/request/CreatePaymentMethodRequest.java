package com.obsidian.curator.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePaymentMethodRequest {
    @NotBlank
    private String cardHolderName;

    @NotBlank
    private String cardNumber;

    @NotBlank
    private String expiryDate;

    @NotBlank
    private String cvv;

    private Boolean isDefault = false;
}
