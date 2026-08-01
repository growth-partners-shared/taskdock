package com.taskdock.taskdock_api.services.notifications;

import com.taskdock.taskdock_api.enums.NotificationChannel;
import com.taskdock.taskdock_api.enums.NotificationType;

public interface NotificationRateLimitService {

  void validateLimit(Long userId, NotificationChannel channel, NotificationType type);
}
