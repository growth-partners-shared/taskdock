package com.taskdock.taskdock_api.utils;

import java.time.Duration;

public final class VerificationConstants {

  private VerificationConstants() {}

  public static final Duration EMAIL_OTP_EXPIRY = Duration.ofMinutes(10);

  public static final Duration RESET_PASSWORD_OTP_EXPIRY = Duration.ofMinutes(10);

  public static final Duration RESET_PASSWORD_TOKEN_EXPIRY = Duration.ofMinutes(10);
}
