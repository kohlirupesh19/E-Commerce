package com.obsidian.curator.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthTokenResponse {
    private String accessToken;
    private AuthUserResponse user;
}
