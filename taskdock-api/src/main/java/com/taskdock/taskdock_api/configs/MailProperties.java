package com.taskdock.taskdock_api.configs;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.mail")
@Data
public class MailProperties {

  private String from;

  private String applicationName;
}
