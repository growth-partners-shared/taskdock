package com.taskdock.taskdock_api.configs;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.notification")
@Data
public class NotificationProperties {
  private String apiKey;
  private String senderEmail;
  private String senderName;
  private String baseUrl;
}
