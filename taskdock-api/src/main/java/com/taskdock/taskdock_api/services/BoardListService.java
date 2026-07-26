package com.taskdock.taskdock_api.services;

import com.taskdock.taskdock_api.dtos.boardlists.BoardListResponse;
import com.taskdock.taskdock_api.dtos.boardlists.BoardListsResponse;
import com.taskdock.taskdock_api.dtos.boardlists.CreateBoardListRequest;
import com.taskdock.taskdock_api.dtos.boardlists.ReorderBoardListsRequest;
import com.taskdock.taskdock_api.dtos.boardlists.UpdateBoardListRequest;

public interface BoardListService {

  BoardListResponse createBoardList(Long boardId, CreateBoardListRequest request);

  BoardListsResponse getBoardLists(Long boardId);

  BoardListResponse updateBoardList(Long boardId, Long listId, UpdateBoardListRequest request);

  void reorderBoardLists(Long boardId, ReorderBoardListsRequest request);

  void deleteBoardList(Long boardId, Long listId);
}
