package com.obsidian.curator.service;

import com.obsidian.curator.dto.request.*;
import com.obsidian.curator.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    MessageResponse register(RegisterRequest request);
    AuthTokenResponse verifyOtp(VerifyOtpRequest request, HttpServletResponse response);
    MessageResponse resendOtp(ResendOtpRequest request);
    AuthTokenResponse login(LoginRequest request, HttpServletResponse response);
    AccessTokenResponse refreshToken(HttpServletRequest request);
    MessageResponse logout(HttpServletRequest request, HttpServletResponse response);
    MessageResponse forgotPassword(ForgotPasswordRequest request);
    ResetTokenResponse verifyForgotPasswordOtp(VerifyForgotOtpRequest request);
    MessageResponse resetPassword(ResetPasswordRequest request);
    MeResponse me(String email);
    MeResponse updateMe(String email, UpdateMeRequest request);
    MessageResponse changePassword(String email, ChangePasswordRequest request);
    MessageResponse toggle2fa(String email, Toggle2FARequest request);
}
