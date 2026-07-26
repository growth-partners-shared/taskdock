package com.taskdock.taskdock_api.controllers;

import com.taskdock.taskdock_api.dtos.auth.*;
import com.taskdock.taskdock_api.services.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthController {

  AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> registerUser(
      @Valid @RequestBody RegisterRequest request) {

    return ResponseEntity.ok(authService.registerUser(request));
  }

  @PostMapping("/verify-email")
  @ResponseStatus(HttpStatus.OK)
  public void verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {

    authService.verifyEmail(request);
  }

  @PostMapping("/resend-verification")
  @ResponseStatus(HttpStatus.OK)
  public void resendVerification(@RequestBody @Valid ResendVerificationRequest request) {

    authService.resendVerification(request);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.loginUser(request));
  }

  @PostMapping("/forgot-password")
  @ResponseStatus(HttpStatus.OK)
  public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {

    authService.forgotPassword(request);
  }

  @PostMapping("/verify-reset-password")
  public ResponseEntity<ResetPasswordVerificationResponse> verifyResetPassword(
      @Valid @RequestBody VerifyEmailRequest request) {

    return ResponseEntity.ok(authService.verifyResetPassword(request));
  }

  @PostMapping("/reset-password")
  @ResponseStatus(HttpStatus.OK)
  public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {

    authService.resetPassword(request);
  }
}
