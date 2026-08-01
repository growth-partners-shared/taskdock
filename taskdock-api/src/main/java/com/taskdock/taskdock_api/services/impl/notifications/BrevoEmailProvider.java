package com.taskdock.taskdock_api.services.impl.notifications;

import com.taskdock.taskdock_api.clients.BrevoEmailClient;
import com.taskdock.taskdock_api.configs.NotificationProperties;
import com.taskdock.taskdock_api.dtos.notifications.email.BrevoEmailRequest;
import com.taskdock.taskdock_api.dtos.notifications.email.BrevoRecipient;
import com.taskdock.taskdock_api.dtos.notifications.email.BrevoSender;
import com.taskdock.taskdock_api.services.notifications.EmailProvider;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrevoEmailProvider implements EmailProvider {

  BrevoEmailClient brevoEmailClient;
  NotificationProperties notificationProperties;

  @Override
  public String send(String to, String recipientName, String subject, String html) {

    BrevoEmailRequest request =
        new BrevoEmailRequest(
            new BrevoSender(
                notificationProperties.getSenderEmail(), notificationProperties.getSenderName()),
            List.of(new BrevoRecipient(to, recipientName)),
            subject,
            html);
    return brevoEmailClient.send(request).messageId();
  }
}
