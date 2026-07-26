package com.taskdock.taskdock_api.dtos.users;

import com.taskdock.taskdock_api.enums.UserStatus;
import java.time.Instant;

public record UserResponse(
    String fullName,
    String email,
    boolean emailVerified,
    String phoneNumber,
    String profileImageUrl,
    Instant lastLoginAt,
    Instant createdAt,
    UserStatus status) {}
