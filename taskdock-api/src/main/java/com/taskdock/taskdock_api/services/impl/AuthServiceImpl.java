package com.taskdock.taskdock_api.services.impl;

import com.taskdock.taskdock_api.dtos.auth.*;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.exceptions.BadRequestException;
import com.taskdock.taskdock_api.exceptions.ResourceNotFoundException;
import com.taskdock.taskdock_api.mappers.UserMapper;
import com.taskdock.taskdock_api.repositories.UserRepository;
import com.taskdock.taskdock_api.services.AuthService;
import com.taskdock.taskdock_api.services.JwtService;
import com.taskdock.taskdock_api.services.NotificationService;
import com.taskdock.taskdock_api.utils.OtpGenerator;
import com.taskdock.taskdock_api.utils.VerificationConstants;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthServiceImpl implements AuthService {

  UserRepository userRepository;
  UserMapper userMapper;
  PasswordEncoder passwordEncoder;
  JwtService jwtService;
  AuthenticationManager authenticationManager;
  NotificationService notificationService;

  @Override
  public RegisterResponse registerUser(RegisterRequest request) {

    if (userRepository.existsByEmail(request.email())) {
      throw new BadRequestException("Email already exists.");
    }

    if (userRepository.existsByPhoneNumber(request.phoneNumber())) {
      throw new BadRequestException("Phone number already exists.");
    }

    User user = userMapper.toEntity(request);

    user.setPasswordHash(passwordEncoder.encode(request.password()));

    user.setEmailVerified(false);

    generateEmailVerificationCode(user);

    user = userRepository.save(user);

    notificationService.sendEmailVerificationNotification(user);

    return new RegisterResponse(user.getEmail(), user.getEmailVerified());
  }

  @Override
  public void verifyEmail(VerifyEmailRequest request) {

    User user = getUserByEmail(request.email());

    validateEmailNotVerified(user);

    if (!user.getEmailVerificationCode().equals(request.verificationCode())) {
      throw new BadRequestException("Invalid verification code.");
    }

    if (user.getEmailVerificationExpiry().isBefore(Instant.now())) {
      throw new BadRequestException("Verification code has expired.");
    }

    user.setEmailVerified(true);
    user.setEmailVerificationCode(null);
    user.setEmailVerificationExpiry(null);

    userRepository.save(user);

    notificationService.sendUserWelcomeNotification(user);
  }

  @Override
  public void resendVerification(ResendVerificationRequest request) {

    User user = getUserByEmail(request.email());

    validateEmailNotVerified(user);

    generateEmailVerificationCode(user);

    userRepository.save(user);

    notificationService.sendEmailVerificationNotification(user);
  }

  @Override
  public AuthResponse loginUser(LoginRequest request) {

    User user = getUserByEmail(request.email());

    if (!Boolean.TRUE.equals(user.getEmailVerified())) {
      throw new BadRequestException("Please verify your email before logging in.");
    }

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));

    user.setLastLoginAt(Instant.now());

    userRepository.save(user);

    String accessToken = jwtService.generateToken(user);

    return new AuthResponse(
        accessToken,
        "Bearer",
        jwtService.extractExpiration(accessToken),
        userMapper.toUserResponse(user));
  }

  // -----------------------------------------------------------------------------
  // Helper Methods
  // -----------------------------------------------------------------------------

  private User getUserByEmail(String email) {

    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with email: ", email));
  }

  private void generateEmailVerificationCode(User user) {

    user.setEmailVerificationCode(OtpGenerator.generateOtp());

    user.setEmailVerificationExpiry(Instant.now().plus(VerificationConstants.EMAIL_OTP_EXPIRY));
  }

  private void validateEmailNotVerified(User user) {

    if (Boolean.TRUE.equals(user.getEmailVerified())) {
      throw new BadRequestException("Email is already verified.");
    }
  }
}
