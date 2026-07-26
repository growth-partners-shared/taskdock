package com.taskdock.taskdock_api.services;

import com.taskdock.taskdock_api.dtos.boards.*;
import java.util.List;

public interface BoardService {

  BoardResponse createBoard(CreateBoardRequest request);

  BoardsResponse getAccessibleBoards();

  BoardViewResponse getBoardView(Long boardId);

  BoardResponse updateBoard(Long boardId, UpdateBoardRequest request);

  void deleteBoard(Long boardId);

  List<BoardColorResponse> getColors();

  void starBoard(Long boardId);

  void unstarBoard(Long boardId);
}
