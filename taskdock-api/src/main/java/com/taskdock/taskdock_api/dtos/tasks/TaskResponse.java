package com.taskdock.taskdock_api.dtos.tasks;

import com.taskdock.taskdock_api.enums.TaskPriority;
import java.time.Instant;
import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskPriority priority,
    LocalDateTime dueDate,
    Integer position,
    Long boardListId,
    Long assigneeUserId,
    String assigneeName,
    String assigneeProfileImageUrl,
    Long createdById,
    String createdByName,
    String createdByProfileImageUrl,
    Instant createdAt,
    Instant updatedAt) {}
