package com.taskdock.taskdock_api.dtos.boards;

import com.taskdock.taskdock_api.dtos.tasks.TaskResponse;
import java.util.List;

public record BoardListWithTasksResponse(
    Long id, String name, int position, List<TaskResponse> tasks) {}
