package com.taskdock.taskdock_api.mappers;

import com.taskdock.taskdock_api.dtos.boardlists.BoardListResponse;
import com.taskdock.taskdock_api.dtos.boardlists.CreateBoardListRequest;
import com.taskdock.taskdock_api.dtos.boardlists.UpdateBoardListRequest;
import com.taskdock.taskdock_api.entities.BoardList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BoardListMapper {

  public BoardList toEntity(CreateBoardListRequest request) {
    if (request == null) {
      return null;
    }

    return BoardList.builder().name(request.name()).build();
  }

  public BoardListResponse toBoardListResponse(BoardList boardList) {
    if (boardList == null) {
      return null;
    }

    return new BoardListResponse(
        boardList.getId(),
        boardList.getName(),
        boardList.getPosition(),
        boardList.getCreatedAt(),
        boardList.getUpdatedAt());
  }

  public List<BoardListResponse> toBoardListResponses(List<BoardList> boardLists) {
    if (boardLists == null) {
      return Collections.emptyList();
    }

    return boardLists.stream().map(this::toBoardListResponse).toList();
  }

  public void updateBoardListFromRequest(UpdateBoardListRequest request, BoardList boardList) {

    if (request == null || boardList == null) {
      return;
    }

    if (request.name() != null) {
      boardList.setName(request.name());
    }
  }
}
