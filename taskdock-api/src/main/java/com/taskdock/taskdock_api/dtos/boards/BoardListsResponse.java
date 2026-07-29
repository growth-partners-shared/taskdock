package com.taskdock.taskdock_api.dtos.boards;

import java.util.List;

public record BoardListsResponse(
    List<BoardListWithTasksResponse> lists,
    int totalLists,
    int maxTotalLists,
    boolean canCreateList) {}
