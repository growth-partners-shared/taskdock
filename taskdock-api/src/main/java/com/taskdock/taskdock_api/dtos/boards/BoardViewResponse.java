package com.taskdock.taskdock_api.dtos.boards;

import com.taskdock.taskdock_api.dtos.members.MemberListResponse;

public record BoardViewResponse(
    BoardResponse board, MemberListResponse members, BoardListsResponse lists) {}
