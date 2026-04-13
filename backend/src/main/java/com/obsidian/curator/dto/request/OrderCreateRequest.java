package com.obsidian.curator.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OrderCreateRequest(
        @NotNull(message = "Address id is required") UUID addressId,
        @NotBlank(message = "Payment method is required") String paymentMethod,
        String couponCode
) {
}
