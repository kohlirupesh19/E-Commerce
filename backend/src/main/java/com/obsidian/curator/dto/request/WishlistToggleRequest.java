package com.obsidian.curator.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record WishlistToggleRequest(
        @NotNull(message = "Product id is required") UUID productId
) {
}
