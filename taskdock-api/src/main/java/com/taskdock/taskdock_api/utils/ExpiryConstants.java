package com.taskdock.taskdock_api.utils;

import java.time.Duration;

public final class ExpiryConstants {

  private ExpiryConstants() {}

  public static final Duration JWT_EXPIRY = Duration.ofDays(1);

  public static final Duration EMAIL_OTP_EXPIRY = Duration.ofMinutes(10);

  public static final Duration RESET_PASSWORD_OTP_EXPIRY = Duration.ofMinutes(10);

  public static final Duration RESET_PASSWORD_TOKEN_EXPIRY = Duration.ofMinutes(10);
}
