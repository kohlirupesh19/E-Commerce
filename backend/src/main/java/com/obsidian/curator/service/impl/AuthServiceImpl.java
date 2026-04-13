package com.obsidian.curator.service.impl;

import com.obsidian.curator.dto.request.*;
import com.obsidian.curator.dto.response.*;
import com.obsidian.curator.entity.OtpToken;
import com.obsidian.curator.entity.RefreshToken;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.entity.enums.OtpType;
import com.obsidian.curator.entity.enums.Role;
import com.obsidian.curator.exception.DuplicateEmailException;
import com.obsidian.curator.exception.OtpExpiredException;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.exception.UnauthorizedException;
import com.obsidian.curator.repository.OtpTokenRepository;
import com.obsidian.curator.repository.RefreshTokenRepository;
import com.obsidian.curator.repository.UserRepository;
import com.obsidian.curator.security.JwtUtil;
import com.obsidian.curator.service.AuthService;
import com.obsidian.curator.util.EmailUtil;
import com.obsidian.curator.util.OtpUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpUtil otpUtil;
    private final EmailUtil emailUtil;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-token-expiry}")
    private long refreshTokenExpiryMs;

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (Boolean.FALSE.equals(request.getAgreeTerms())) {
            throw new UnauthorizedException("You must agree to terms to continue");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new UnauthorizedException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setIsVerified(false);
        userRepository.save(user);

        createAndSendOtp(user, OtpType.REGISTER);
        return new MessageResponse("OTP sent to email");
    }

    @Override
    @Transactional
    public AuthTokenResponse verifyOtp(VerifyOtpRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        OtpToken otp = otpTokenRepository.findFirstByUserAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(user, request.getType())
                .orElseThrow(() -> new OtpExpiredException("OTP expired or invalid"));

        if (Instant.now().isAfter(otp.getExpiresAt()) || !otp.getOtpCode().equals(request.getOtp())) {
            throw new OtpExpiredException("OTP expired or invalid");
        }

        otp.setIsUsed(true);
        otpTokenRepository.save(otp);

        if (request.getType() == OtpType.REGISTER) {
            user.setIsVerified(true);
            userRepository.save(user);
        }

        return issueTokens(user, response);
    }

    @Override
    @Transactional
    public MessageResponse resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<OtpToken> active = otpTokenRepository.findByUserAndOtpTypeAndIsUsedFalse(user, request.getType());
        active.forEach(token -> token.setIsUsed(true));
        otpTokenRepository.saveAll(active);

        createAndSendOtp(user, request.getType());
        return new MessageResponse("OTP sent to email");
    }

    @Override
    @Transactional
    public AuthTokenResponse login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!Boolean.TRUE.equals(user.getIsVerified())) {
            throw new UnauthorizedException("Please verify your email first");
        }

        return issueTokens(user, response);
    }

    @Override
    public AccessTokenResponse refreshToken(HttpServletRequest request) {
        String token = readRefreshToken(request)
                .orElseThrow(() -> new UnauthorizedException("Refresh token missing"));

        RefreshToken stored = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (stored.getExpiresAt().isBefore(Instant.now()) || !jwtUtil.isValid(token)) {
            refreshTokenRepository.delete(stored);
            throw new UnauthorizedException("Refresh token expired");
        }

        User user = stored.getUser();
        String accessToken = jwtUtil.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
        return new AccessTokenResponse(accessToken);
    }

    @Override
    @Transactional
    public MessageResponse logout(HttpServletRequest request, HttpServletResponse response) {
        readRefreshToken(request).ifPresent(refreshTokenRepository::deleteByToken);
        clearRefreshCookie(response);
        return new MessageResponse("Logged out");
    }

    @Override
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> user = userRepository.findByEmailIgnoreCase(request.getEmail());
        if (user.isPresent()) {
            createAndSendOtp(user.get(), OtpType.FORGOT_PASSWORD);
        }
        return new MessageResponse("Reset code sent if email exists");
    }

    @Override
    @Transactional
    public ResetTokenResponse verifyForgotPasswordOtp(VerifyForgotOtpRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new OtpExpiredException("OTP expired or invalid"));

        OtpToken otp = otpTokenRepository.findFirstByUserAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(user, OtpType.FORGOT_PASSWORD)
                .orElseThrow(() -> new OtpExpiredException("OTP expired or invalid"));

        if (Instant.now().isAfter(otp.getExpiresAt()) || !otp.getOtpCode().equals(request.getOtp())) {
            throw new OtpExpiredException("OTP expired or invalid");
        }

        otp.setIsUsed(true);
        otpTokenRepository.save(otp);

        return new ResetTokenResponse(jwtUtil.generateResetToken(user.getEmail()));
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new UnauthorizedException("Password and confirm password do not match");
        }

        Claims claims = jwtUtil.parseClaims(request.getResetToken());
        String email = claims.get("email", String.class);

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenRepository.deleteByUser(user);
        return new MessageResponse("Password reset successful");
    }

    @Override
    public MeResponse me(String email) {
        User user = getUserByEmail(email);
        return mapMe(user);
    }

    @Override
    @Transactional
    public MeResponse updateMe(String email, UpdateMeRequest request) {
        User user = getUserByEmail(email);

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getDob() != null) user.setDateOfBirth(request.getDob());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAvatar() != null) user.setAvatarUrl(request.getAvatar());

        userRepository.save(Objects.requireNonNull(user));
        return mapMe(user);
    }

    @Override
    @Transactional
    public MessageResponse changePassword(String email, ChangePasswordRequest request) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new UnauthorizedException("Password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenRepository.deleteByUser(user);

        return new MessageResponse("Password changed successfully");
    }

    @Override
    @Transactional
    public MessageResponse toggle2fa(String email, Toggle2FARequest request) {
        User user = getUserByEmail(email);
        user.setTwoFactorEnabled(request.getEnabled());
        userRepository.save(Objects.requireNonNull(user));
        return new MessageResponse("2FA updated");
    }

    private AuthTokenResponse issueTokens(User user, HttpServletResponse response) {
        String accessToken = jwtUtil.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId().toString(), user.getEmail(), user.getRole().name());

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(refreshToken);
        token.setExpiresAt(Instant.now().plusMillis(refreshTokenExpiryMs));
        refreshTokenRepository.save(token);

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshTokenExpiryMs / 1000));
        response.addCookie(cookie);

        return AuthTokenResponse.builder()
                .accessToken(accessToken)
                .user(AuthUserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .avatar(user.getAvatarUrl())
                        .build())
                .build();
    }

    private Optional<String> readRefreshToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    return Optional.ofNullable(cookie.getValue());
                }
            }
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return Optional.of(header.substring(7));
        }
        return Optional.empty();
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private void createAndSendOtp(User user, OtpType type) {
        OtpToken otpToken = new OtpToken();
        otpToken.setUser(user);
        otpToken.setOtpType(type);
        otpToken.setOtpCode(otpUtil.generate6DigitOtp());
        otpToken.setExpiresAt(Instant.now().plusSeconds(5 * 60));
        otpTokenRepository.save(otpToken);

        emailUtil.sendOtpEmail(user.getEmail(), otpToken.getOtpCode());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private MeResponse mapMe(User user) {
        return MeResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatar(user.getAvatarUrl())
                .dob(user.getDateOfBirth())
                .gender(user.getGender())
                .twoFactorEnabled(user.getTwoFactorEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
