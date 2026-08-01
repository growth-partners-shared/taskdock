package com.taskdock.taskdock_api.repositories;

import com.taskdock.taskdock_api.entities.Notification;
import com.taskdock.taskdock_api.enums.NotificationChannel;
import com.taskdock.taskdock_api.enums.NotificationStatus;
import com.taskdock.taskdock_api.enums.NotificationType;
import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  long countByUserIdAndChannelAndTypeAndStatusAndCreatedAtBetween(
      Long userId,
      NotificationChannel channel,
      NotificationType type,
      NotificationStatus status,
      Instant start,
      Instant end);
}
