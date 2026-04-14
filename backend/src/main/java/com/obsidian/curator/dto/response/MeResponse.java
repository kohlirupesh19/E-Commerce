package com.obsidian.curator.dto.response;

import com.obsidian.curator.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class MeResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String avatar;
    private LocalDate dob;
    private String gender;
    private Boolean twoFactorEnabled;
    private Boolean orderUpdates;
    private Boolean newCollections;
    private Boolean securityAlerts;
    private Boolean newsletter;
    private Instant createdAt;
}
