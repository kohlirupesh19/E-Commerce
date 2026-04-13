package com.obsidian.curator.repository;

import com.obsidian.curator.entity.OtpToken;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.entity.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OtpTokenRepository extends JpaRepository<OtpToken, UUID> {
    Optional<OtpToken> findFirstByUserAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(User user, OtpType otpType);
    List<OtpToken> findByUserAndOtpTypeAndIsUsedFalse(User user, OtpType otpType);
}
