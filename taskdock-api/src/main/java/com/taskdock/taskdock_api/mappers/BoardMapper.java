package com.taskdock.taskdock_api.mappers;

import com.taskdock.taskdock_api.dtos.boards.CreateBoardRequest;
import com.taskdock.taskdock_api.dtos.boards.UpdateBoardRequest;
import com.taskdock.taskdock_api.entities.Board;
import org.springframework.stereotype.Component;

@Component
public class BoardMapper {

  public Board toEntity(CreateBoardRequest request) {
    if (request == null) {
      return null;
    }

    return Board.builder()
        .name(request.name())
        .description(request.description())
        .color(request.color())
        .build();
  }

  public void updateBoardFromRequest(UpdateBoardRequest request, Board board) {
    if (request == null || board == null) {
      return;
    }

    if (request.name() != null) {
      board.setName(request.name());
    }

    if (request.description() != null) {
      board.setDescription(request.description());
    }

    if (request.color() != null) {
      board.setColor(request.color());
    }
  }
}
