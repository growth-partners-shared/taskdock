package com.taskdock.taskdock_api.dtos.users;

import java.time.Instant;

public record UserResponse(
    String fullName,
    String email,
    boolean emailVerified,
    String phoneNumber,
    String profileImageUrl,
    Instant lastLoginAt,
    Instant createdAt) {}
