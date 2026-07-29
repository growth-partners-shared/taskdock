package com.taskdock.taskdock_api.services.impl;

import static com.taskdock.taskdock_api.enums.UserStatus.*;

import com.taskdock.taskdock_api.dtos.auth.*;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.enums.UserStatus;
import com.taskdock.taskdock_api.exceptions.BadRequestException;
import com.taskdock.taskdock_api.exceptions.ResourceNotFoundException;
import com.taskdock.taskdock_api.mappers.UserMapper;
import com.taskdock.taskdock_api.repositories.UserRepository;
import com.taskdock.taskdock_api.services.AuthService;
import com.taskdock.taskdock_api.services.JwtService;
import com.taskdock.taskdock_api.services.NotificationService;
import com.taskdock.taskdock_api.utils.ExpiryConstants;
import com.taskdock.taskdock_api.utils.OtpGenerator;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthServiceImpl implements AuthService {

  UserMapper userMapper;
  JwtService jwtService;
  NotificationService notificationService;
  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  AuthenticationManager authenticationManager;

  @Override
  public RegisterResponse registerUser(RegisterRequest request) {

    User existingUser = userRepository.findByEmail(request.email()).orElse(null);

    if (existingUser != null) {

      switch (existingUser.getStatus()) {
        case ACTIVE -> throw new BadRequestException("Email already exists.");

        case PENDING -> {
          generateEmailVerificationCode(existingUser);

          userRepository.save(existingUser);

          notificationService.sendEmailVerificationNotification(existingUser);

          return new RegisterResponse(
              existingUser.getEmail(), existingUser.getEmailVerified(), existingUser.getStatus());
        }

        case INACTIVE -> {
          if (userRepository.existsByPhoneNumberAndIdNot(
              request.phoneNumber(), existingUser.getId())) {

            throw new BadRequestException("Phone number already exists.");
          }

          existingUser.setFullName(request.fullName());
          existingUser.setPhoneNumber(request.phoneNumber());
          existingUser.setPasswordHash(passwordEncoder.encode(request.password()));

          existingUser.setEmailVerified(false);
          existingUser.setStatus(UserStatus.PENDING);

          generateEmailVerificationCode(existingUser);

          userRepository.save(existingUser);

          notificationService.sendEmailVerificationNotification(existingUser);

          return new RegisterResponse(
              existingUser.getEmail(), existingUser.getEmailVerified(), existingUser.getStatus());
        }
      }
    }

    if (userRepository.existsByPhoneNumber(request.phoneNumber())) {
      throw new BadRequestException("Phone number already exists.");
    }

    User user = toEntity(request);

    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setEmailVerified(false);
    user.setStatus(UserStatus.PENDING);

    generateEmailVerificationCode(user);

    user = userRepository.save(user);

    notificationService.sendEmailVerificationNotification(user);

    return new RegisterResponse(user.getEmail(), user.getEmailVerified(), user.getStatus());
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
    user.setStatus(ACTIVE);

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

    if(user.getStatus().equals(INACTIVE))
        throw new ResourceNotFoundException("User not found with email: ", request.email());

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

  @Override
  public void forgotPassword(ForgotPasswordRequest request) {

    User user = getUserByEmail(request.email());

    if (user.getStatus() != ACTIVE) {
      throw new BadRequestException("Account is not active.");
    }

    if (!Boolean.TRUE.equals(user.getEmailVerified())) {
      throw new BadRequestException("Email is not verified.");
    }

    generatePasswordResetVerificationCode(user);

    user.setPasswordResetToken(null);
    user.setPasswordResetTokenExpiry(null);

    userRepository.save(user);

    notificationService.sendPasswordResetVerificationNotification(user);
  }

  @Override
  public ResetPasswordVerificationResponse verifyResetPassword(VerifyEmailRequest request) {

    User user = getUserByEmail(request.email());

    if (user.getStatus() != ACTIVE) {
      throw new BadRequestException("Account is not active.");
    }

    if (!Boolean.TRUE.equals(user.getEmailVerified())) {
      throw new BadRequestException("Email is not verified.");
    }

    if (user.getPasswordResetCode() == null || user.getPasswordResetExpiry() == null) {
      throw new BadRequestException("No password reset request found.");
    }

    if (!user.getPasswordResetCode().equals(request.verificationCode())) {
      throw new BadRequestException("Invalid verification code.");
    }

    if (user.getPasswordResetExpiry().isBefore(Instant.now())) {
      throw new BadRequestException("Verification code has expired.");
    }

    user.setPasswordResetCode(null);
    user.setPasswordResetExpiry(null);

    user.setPasswordResetToken(UUID.randomUUID().toString());
    user.setPasswordResetTokenExpiry(
        Instant.now().plus(ExpiryConstants.RESET_PASSWORD_TOKEN_EXPIRY));

    userRepository.save(user);

    return new ResetPasswordVerificationResponse(user.getPasswordResetToken());
  }

  @Override
  public void resetPassword(ResetPasswordRequest request) {

    User user = getUserByEmail(request.email());

    if (user.getStatus() != ACTIVE) {
      throw new BadRequestException("Account is not active.");
    }

    if (!Boolean.TRUE.equals(user.getEmailVerified())) {
      throw new BadRequestException("Email is not verified.");
    }

    if (user.getPasswordResetToken() == null || user.getPasswordResetTokenExpiry() == null) {
      throw new BadRequestException("Password reset verification required.");
    }

    if (!user.getPasswordResetToken().equals(request.resetToken())) {
      throw new BadRequestException("Invalid reset token.");
    }

    if (user.getPasswordResetTokenExpiry().isBefore(Instant.now())) {
      throw new BadRequestException("Password reset session has expired.");
    }

    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));

    user.setPasswordResetToken(null);
    user.setPasswordResetTokenExpiry(null);

    userRepository.save(user);
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

    user.setEmailVerificationExpiry(Instant.now().plus(ExpiryConstants.EMAIL_OTP_EXPIRY));
  }

  private void generatePasswordResetVerificationCode(User user) {

    user.setPasswordResetCode(OtpGenerator.generateOtp());

    user.setPasswordResetExpiry(Instant.now().plus(ExpiryConstants.RESET_PASSWORD_OTP_EXPIRY));
  }

  private void validateEmailNotVerified(User user) {

    if (Boolean.TRUE.equals(user.getEmailVerified())) {
      throw new BadRequestException("Email is already verified.");
    }
  }

  private User toEntity(RegisterRequest request) {
    return User.builder()
        .fullName(request.fullName())
        .email(request.email())
        .phoneNumber(request.phoneNumber())
        .passwordHash(passwordEncoder.encode(request.password()))
        .build();
  }
}
