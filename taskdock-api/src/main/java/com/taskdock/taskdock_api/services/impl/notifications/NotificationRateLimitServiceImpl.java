package com.taskdock.taskdock_api.services.impl.notifications;

import static com.taskdock.taskdock_api.utils.AppConstants.MAX_EMAILS_PER_DAY;

import com.taskdock.taskdock_api.enums.NotificationChannel;
import com.taskdock.taskdock_api.enums.NotificationStatus;
import com.taskdock.taskdock_api.enums.NotificationType;
import com.taskdock.taskdock_api.exceptions.RateLimitExceededException;
import com.taskdock.taskdock_api.repositories.NotificationRepository;
import com.taskdock.taskdock_api.services.notifications.NotificationRateLimitService;
import java.time.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationRateLimitServiceImpl implements NotificationRateLimitService {

  NotificationRepository notificationRepository;

  @Override
  public void validateLimit(Long userId, NotificationChannel channel, NotificationType type) {

    Instant start = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);

    Instant end = LocalDate.now().plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

    long count =
        notificationRepository.countByUserIdAndChannelAndTypeAndStatusAndCreatedAtBetween(
            userId, channel, type, NotificationStatus.SENT, start, end);

    if (count >= MAX_EMAILS_PER_DAY) {
      throw new RateLimitExceededException("Daily notification limit exceeded.");
    }
  }
}
