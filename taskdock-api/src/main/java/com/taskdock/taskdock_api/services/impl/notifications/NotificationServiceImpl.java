package com.taskdock.taskdock_api.services.impl.notifications;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.Notification;
import com.taskdock.taskdock_api.entities.Task;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.enums.NotificationChannel;
import com.taskdock.taskdock_api.enums.NotificationStatus;
import com.taskdock.taskdock_api.enums.NotificationType;
import com.taskdock.taskdock_api.exceptions.NotificationProviderException;
import com.taskdock.taskdock_api.repositories.NotificationRepository;
import com.taskdock.taskdock_api.repositories.UserRepository;
import com.taskdock.taskdock_api.services.notifications.EmailProvider;
import com.taskdock.taskdock_api.services.notifications.NotificationRateLimitService;
import com.taskdock.taskdock_api.services.notifications.NotificationService;
import com.taskdock.taskdock_api.utils.EmailTemplateBuilder;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {

  UserRepository userRepository;
  NotificationRepository notificationRepository;
  EmailProvider emailProvider;
  EmailTemplateBuilder templateBuilder;
  NotificationRateLimitService notificationRateLimitService;

  @Override
  public void sendEmailVerificationNotification(User user) {

    User managedUser = userRepository.findById(user.getId()).orElseThrow();

    notificationRateLimitService.validateLimit(
        managedUser.getId(), NotificationChannel.EMAIL, NotificationType.EMAIL_VERIFICATION);

    String html = templateBuilder.buildEmailVerificationTemplate(managedUser);

    sendEmail(
        managedUser,
        NotificationType.EMAIL_VERIFICATION,
        NotificationType.EMAIL_VERIFICATION.getSubject(),
        html);
  }

  @Override
  public void sendPasswordResetVerificationNotification(User user) {

    notificationRateLimitService.validateLimit(
        user.getId(), NotificationChannel.EMAIL, NotificationType.PASSWORD_RESET);

    String html = templateBuilder.buildForgotPasswordTemplate(user);

    sendEmail(
        user, NotificationType.PASSWORD_RESET, NotificationType.PASSWORD_RESET.getSubject(), html);
  }

  @Override
  @Async
  public void sendUserWelcomeNotification(User user) {

    String html = templateBuilder.buildWelcomeTemplate(user);

    sendEmail(user, NotificationType.WELCOME, NotificationType.WELCOME.getSubject(), html);
  }

  @Override
  @Async
  public void sendBoardInvitation(User invitedUser, User invitedBy, Board board) {

    String html = templateBuilder.buildBoardInvitationTemplate(invitedUser, invitedBy, board);

    sendEmail(
        invitedUser,
        NotificationType.BOARD_INVITATION,
        NotificationType.BOARD_INVITATION.getSubject(),
        html);
  }

  @Override
  @Async
  public void sendTaskAssignedNotification(User assignee, User assignedBy, Task task) {

    String html = templateBuilder.buildTaskAssignedTemplate(assignee, assignedBy, task);

    sendEmail(
        assignee,
        NotificationType.TASK_ASSIGNED,
        NotificationType.TASK_ASSIGNED.getSubject(),
        html);
  }

  // -------------------------------------------------------------------------
  // Helper
  // -------------------------------------------------------------------------

  private void sendEmail(User user, NotificationType type, String subject, String html) {

    Notification notification =
        Notification.builder()
            .user(user)
            .recipientEmail(user.getEmail())
            .recipientName(user.getFullName())
            .subject(subject)
            .content(html)
            .channel(NotificationChannel.EMAIL)
            .type(type)
            .status(NotificationStatus.PENDING)
            .build();

    notification = notificationRepository.save(notification);

    try {

      emailProvider.send(user.getEmail(), user.getFullName(), subject, html);

      notification.setStatus(NotificationStatus.SENT);
      notification.setSentAt(LocalDateTime.now());

    } catch (Exception ex) {

      notification.setStatus(NotificationStatus.FAILED);
      notification.setErrorMessage(ex.getMessage());

      log.error("Notification failed for user {}", user.getId(), ex);

      throw new NotificationProviderException("Failed to send notification", ex);
    } finally {

      notificationRepository.save(notification);
    }
  }
}
