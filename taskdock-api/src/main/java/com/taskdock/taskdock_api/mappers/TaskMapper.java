package com.taskdock.taskdock_api.mappers;

import com.taskdock.taskdock_api.dtos.tasks.CreateTaskRequest;
import com.taskdock.taskdock_api.dtos.tasks.TaskResponse;
import com.taskdock.taskdock_api.dtos.tasks.UpdateTaskRequest;
import com.taskdock.taskdock_api.entities.Task;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

  public Task toEntity(CreateTaskRequest request) {
    if (request == null) {
      return null;
    }

    return Task.builder()
        .title(request.title())
        .description(request.description())
        .priority(request.priority())
        .dueDate(request.dueDate())
        .build();
  }

  public TaskResponse toTaskResponse(Task task) {
    if (task == null) {
      return null;
    }

    return new TaskResponse(
        task.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getPriority(),
        task.getDueDate(),
        task.getPosition(),
        task.getBoardList() != null ? task.getBoardList().getId() : null,
        task.getAssignee() != null ? task.getAssignee().getId() : null,
        task.getAssignee() != null ? task.getAssignee().getFullName() : null,
        task.getAssignee() != null ? task.getAssignee().getProfileImageUrl() : null,
        task.getCreatedBy() != null ? task.getCreatedBy().getId() : null,
        task.getCreatedBy() != null ? task.getCreatedBy().getFullName() : null,
        task.getCreatedBy() != null ? task.getCreatedBy().getProfileImageUrl() : null,
        task.getCreatedAt(),
        task.getUpdatedAt());
  }

  public List<TaskResponse> toTaskResponses(List<Task> tasks) {
    if (tasks == null || tasks.isEmpty()) {
      return List.of();
    }

    return tasks.stream().map(this::toTaskResponse).toList();
  }

  public void updateTaskFromRequest(UpdateTaskRequest request, Task task) {
    if (request == null || task == null) {
      return;
    }

    if (request.title() != null) {
      task.setTitle(request.title());
    }

    if (request.description() != null) {
      task.setDescription(request.description());
    }

    if (request.priority() != null) {
      task.setPriority(request.priority());
    }

    if (request.dueDate() != null) {
      task.setDueDate(request.dueDate());
    }
  }
}
