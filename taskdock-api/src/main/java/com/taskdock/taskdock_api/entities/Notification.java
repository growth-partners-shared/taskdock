package com.taskdock.taskdock_api.entities;

import com.taskdock.taskdock_api.enums.NotificationChannel;
import com.taskdock.taskdock_api.enums.NotificationStatus;
import com.taskdock.taskdock_api.enums.NotificationType;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  User user;

  @Column(nullable = false)
  String recipientEmail;

  @Column String recipientName;

  @Column(nullable = false, length = 200)
  String subject;

  @Column(nullable = false, columnDefinition = "TEXT")
  String content;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  NotificationChannel channel;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 40)
  NotificationType type;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  NotificationStatus status;

  /** Message identifier returned by the provider (Brevo, SES, SendGrid, etc.) */
  @Column(length = 255)
  String providerMessageId;

  LocalDateTime sentAt;

  @Column(length = 500)
  String errorMessage;
}
