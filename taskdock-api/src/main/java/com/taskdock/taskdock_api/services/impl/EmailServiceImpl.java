package com.taskdock.taskdock_api.services.impl;

import com.taskdock.taskdock_api.configs.MailProperties;
import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.Task;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.services.EmailService;
import com.taskdock.taskdock_api.utils.EmailSubject;
import com.taskdock.taskdock_api.utils.EmailTemplateBuilder;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {

  JavaMailSender mailSender;

  EmailTemplateBuilder templateBuilder;

  MailProperties mailProperties;

  @Override
  @Async
  public void sendWelcomeEmail(User user) {

    String html = templateBuilder.buildWelcomeTemplate(user);

    sendEmail(user.getEmail(), EmailSubject.WELCOME, html);
  }

  @Override
  @Async
  public void sendBoardInvitationEmail(User invitedUser, User invitedBy, Board board) {

    String html = templateBuilder.buildBoardInvitationTemplate(invitedUser, invitedBy, board);

    sendEmail(invitedUser.getEmail(), EmailSubject.BOARD_INVITATION, html);
  }

  @Override
  @Async
  public void sendTaskAssignedEmail(User assignee, User assignedBy, Task task) {

    String html = templateBuilder.buildTaskAssignedTemplate(assignee, assignedBy, task);

    sendEmail(assignee.getEmail(), EmailSubject.TASK_ASSIGNED, html);
  }

  @Override
  @Async
  public void sendEmailVerificationEmail(User registeredUser) {
    String html = templateBuilder.buildEmailVerificationTemplate(registeredUser);

    sendEmail(registeredUser.getEmail(), EmailSubject.EMAIL_VERIFICATION, html);
  }

  // Helper Method
  private void sendEmail(String to, String subject, String html) {

    try {

      MimeMessage message = mailSender.createMimeMessage();

      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(mailProperties.getFrom());
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(html, true);

      mailSender.send(message);

    } catch (MessagingException ex) {
      throw new RuntimeException("Failed to send email to " + to, ex);
    }
  }
}
