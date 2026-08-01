package com.taskdock.taskdock_api.exceptions;

public class NotificationProviderException extends RuntimeException {

  public NotificationProviderException(String message) {
    super(message);
  }

  public NotificationProviderException(String message, Throwable cause) {
    super(message, cause);
  }
}
