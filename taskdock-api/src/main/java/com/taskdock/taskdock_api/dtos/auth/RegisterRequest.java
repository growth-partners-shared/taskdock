package com.taskdock.taskdock_api.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Full name is required") @Size(min = 2, max = 200) String fullName,
    @NotBlank(message = "Email is required") @Email(message = "Invalid email") String email,
    @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "\\d{10}", message = "Phone number must contain exactly 10 digits")
        String phoneNumber,
    @NotBlank(message = "Password is required")
        @Pattern(
            regexp = "^(?=\\S+$)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,16}$",
            message =
                "Password must be 8 to 16 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
        String password) {}
