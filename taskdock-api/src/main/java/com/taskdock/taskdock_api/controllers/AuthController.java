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
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
    authService.verifyEmail(request);
  }

  @PostMapping("/resend-verification")
  public ResponseEntity<Void> resendVerification(
      @RequestBody @Valid ResendVerificationRequest request) {

    authService.resendVerification(request);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.loginUser(request));
  }
}
