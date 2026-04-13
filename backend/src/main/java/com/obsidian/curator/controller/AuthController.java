package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.*;
import com.obsidian.curator.dto.response.*;
import com.obsidian.curator.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public MessageResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/verify-otp")
    public AuthTokenResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest request, HttpServletResponse response) {
        return authService.verifyOtp(request, response);
    }

    @PostMapping("/resend-otp")
    public MessageResponse resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        return authService.resendOtp(request);
    }

    @PostMapping("/login")
    public AuthTokenResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        return authService.login(request, response);
    }

    @PostMapping("/refresh-token")
    public AccessTokenResponse refreshToken(HttpServletRequest request) {
        return authService.refreshToken(request);
    }

    @PostMapping("/logout")
    public MessageResponse logout(HttpServletRequest request, HttpServletResponse response) {
        return authService.logout(request, response);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/verify-forgot-password-otp")
    public ResetTokenResponse verifyForgotPasswordOtp(@Valid @RequestBody VerifyForgotOtpRequest request) {
        return authService.verifyForgotPasswordOtp(request);
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        return authService.me(authentication.getName());
    }

    @PutMapping("/me")
    public MeResponse updateMe(Authentication authentication, @RequestBody UpdateMeRequest request) {
        return authService.updateMe(authentication.getName(), request);
    }

    @PutMapping("/me/change-password")
    public MessageResponse changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        return authService.changePassword(authentication.getName(), request);
    }

    @PatchMapping("/me/2fa")
    public MessageResponse toggle2fa(Authentication authentication, @Valid @RequestBody Toggle2FARequest request) {
        return authService.toggle2fa(authentication.getName(), request);
    }
}
