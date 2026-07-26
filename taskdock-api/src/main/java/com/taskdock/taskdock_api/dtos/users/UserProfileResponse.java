package com.taskdock.taskdock_api.dtos.users;

import com.taskdock.taskdock_api.enums.UserStatus;
import java.time.Instant;

public record UserProfileResponse(
    String fullName,
    Integer age,
    String email,
    String phoneNumber,
    String profileImageUrl,
    Instant createdAt,
    Instant updatedAt,
    UserStatus status) {}
