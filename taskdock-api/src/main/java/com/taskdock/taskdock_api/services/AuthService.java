package com.taskdock.taskdock_api.services;

import com.taskdock.taskdock_api.dtos.auth.*;

public interface AuthService {

  /**
   * Registers a new user account.
   *
   * <p>Creates the user, generates an email verification code, stores its expiry, and sends a
   * verification email.
   *
   * @param request registration details
   * @return registration response containing email and verification status
   */
  RegisterResponse registerUser(RegisterRequest request);

  /**
   * Verifies the user's email using the verification code.
   *
   * <p>Marks the email as verified if the supplied code is valid and has not expired.
   *
   * @param request email verification request
   */
  void verifyEmail(VerifyEmailRequest request);

  /**
   * Generates and sends a new email verification code.
   *
   * <p>Can only be used for users whose email is not yet verified.
   *
   * @param request resend verification request
   */
  void resendVerification(ResendVerificationRequest request);

  /**
   * Authenticates a verified user and issues a JWT access token.
   *
   * <p>Login is permitted only after successful email verification.
   *
   * @param request login credentials
   * @return authenticated user details along with JWT access token
   */
  AuthResponse loginUser(LoginRequest request);

  /**
   * Initiates the forgot password flow by generating a one-time verification code and sending it to
   * the user's registered email address.
   *
   * @param request forgot password request containing the user's email
   */
  void forgotPassword(ForgotPasswordRequest request);

  /**
   * Verifies the password reset verification code and issues a temporary password reset token that
   * can be used to reset the password.
   *
   * @param request password reset verification request
   * @return temporary password reset verification token
   */
  ResetPasswordVerificationResponse verifyResetPassword(VerifyEmailRequest request);

  /**
   * Resets the user's password after validating the password reset token. The reset token is
   * invalidated after a successful password update.
   *
   * @param request password reset request containing the new password and reset token
   */
  void resetPassword(ResetPasswordRequest request);
}
