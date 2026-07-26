package com.taskdock.taskdock_api.dtos.auth;

import com.taskdock.taskdock_api.enums.UserStatus;

public record RegisterResponse(String email, boolean emailVerified, UserStatus status) {}
