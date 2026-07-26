package com.taskdock.taskdock_api.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResendVerificationRequest(@Email @NotBlank String email) {}
