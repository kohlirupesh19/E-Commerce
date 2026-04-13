package com.obsidian.curator.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyForgotOtpRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String otp;
}
