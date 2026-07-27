package com.taskdock.taskdock_api.dtos.boardlists;

import java.util.List;

public record BoardListsResponse(
    List<BoardListResponse> lists, int totalLists, int maxTotalLists, boolean canCreateList) {}
