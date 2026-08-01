package com.taskdock.taskdock_api.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
  EMAIL_VERIFICATION("Verify your email"),

  PASSWORD_RESET("Reset your password"),

  BOARD_INVITATION("Board Invitation"),

  TASK_ASSIGNED("Task Assigned"),

  WELCOME("Welcome to TaskDock");

  private final String subject;
}
