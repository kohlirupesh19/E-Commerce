package com.obsidian.curator.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Toggle2FARequest {
    @NotNull
    private Boolean enabled;
}
