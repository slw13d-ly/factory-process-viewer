package com.factoryview.backend.dto.auth;

import java.time.LocalDateTime;

import com.factoryview.backend.domain.user.UserAccount;

public record UserResponse(
        Long id,
        String username,
        String displayName,
        String email,
        String role,
        LocalDateTime createdAt
) {
    public static UserResponse from(UserAccount user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
