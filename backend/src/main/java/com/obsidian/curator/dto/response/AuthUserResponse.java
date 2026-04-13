package com.obsidian.curator.dto.response;

import com.obsidian.curator.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthUserResponse {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String avatar;
}
