package com.obsidian.curator.dto.request;

import com.obsidian.curator.entity.enums.OtpType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResendOtpRequest {
    @NotBlank
    @Email
    private String email;

    @NotNull
    private OtpType type;
}
