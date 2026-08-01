package com.taskdock.taskdock_api.dtos.notifications.email;

import java.util.List;

public record BrevoEmailRequest(
    BrevoSender sender, List<BrevoRecipient> to, String subject, String htmlContent) {}
