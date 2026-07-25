package com.taskdock.taskdock_api.services.impl;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.Task;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.services.EmailService;
import com.taskdock.taskdock_api.services.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class NotificationServiceImpl implements NotificationService {

  EmailService emailService;

  @Override
  public void sendUserWelcomeNotification(User user) {

    emailService.sendWelcomeEmail(user);
  }

  @Override
  public void sendBoardInvitation(User invitedUser, User invitedBy, Board board) {

    emailService.sendBoardInvitationEmail(invitedUser, invitedBy, board);
  }

  @Override
  public void sendTaskAssignedNotification(User assignee, User assignedBy, Task task) {

    emailService.sendTaskAssignedEmail(assignee, assignedBy, task);
  }

  @Override
  public void sendEmailVerificationNotification(User registeredUser) {
    emailService.sendEmailVerificationEmail(registeredUser);
  }
}
