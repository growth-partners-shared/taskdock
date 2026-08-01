package com.taskdock.taskdock_api.clients;

import com.taskdock.taskdock_api.configs.NotificationProperties;
import com.taskdock.taskdock_api.dtos.notifications.email.BrevoEmailRequest;
import com.taskdock.taskdock_api.dtos.notifications.email.BrevoEmailResponse;
import com.taskdock.taskdock_api.exceptions.NotificationProviderException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrevoEmailClient {

  NotificationProperties notificationProperties;

  WebClient webClient;

  private static final String API_KEY_HEADER = "api-key";

  public BrevoEmailResponse send(BrevoEmailRequest request) {

    return webClient
        .post()
        .uri(notificationProperties.getBaseUrl() + "/smtp/email")
        .header(API_KEY_HEADER, notificationProperties.getApiKey())
        .contentType(MediaType.APPLICATION_JSON)
        .accept(MediaType.APPLICATION_JSON)
        .bodyValue(request)
        .retrieve()
        .onStatus(
            status -> status.isError(),
            response ->
                response
                    .bodyToMono(String.class)
                    .map(body -> new NotificationProviderException("Brevo API Error: " + body)))
        .bodyToMono(BrevoEmailResponse.class)
        .block();
  }
}
