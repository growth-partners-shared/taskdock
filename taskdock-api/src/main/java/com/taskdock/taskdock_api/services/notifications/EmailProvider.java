package com.taskdock.taskdock_api.services.notifications;

public interface EmailProvider {

  String send(String to, String recipientName, String subject, String html);
}
