package com.taskdock.taskdock_api.dtos.boards;

import java.util.List;

public record BoardsResponse(
    List<BoardResponse> boards,
    int ownedBoards,
    int maxOwnedBoards,
    int sharedBoards,
    boolean canCreateBoard) {}
