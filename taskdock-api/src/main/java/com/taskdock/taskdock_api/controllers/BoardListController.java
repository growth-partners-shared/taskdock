package com.taskdock.taskdock_api.controllers;

import com.taskdock.taskdock_api.dtos.boardlists.BoardListResponse;
import com.taskdock.taskdock_api.dtos.boardlists.CreateBoardListRequest;
import com.taskdock.taskdock_api.dtos.boardlists.ReorderBoardListsRequest;
import com.taskdock.taskdock_api.dtos.boardlists.UpdateBoardListRequest;
import com.taskdock.taskdock_api.services.BoardListService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/boards/{boardId}/lists")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class BoardListController {

  BoardListService boardListService;

  @PostMapping
  public ResponseEntity<BoardListResponse> createBoardList(
      @PathVariable Long boardId, @Valid @RequestBody CreateBoardListRequest request) {

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(boardListService.createBoardList(boardId, request));
  }

  @PatchMapping("/{listId}")
  public ResponseEntity<BoardListResponse> updateBoardList(
      @PathVariable Long boardId,
      @PathVariable Long listId,
      @Valid @RequestBody UpdateBoardListRequest request) {

    return ResponseEntity.ok(boardListService.updateBoardList(boardId, listId, request));
  }

  @PatchMapping("/reorder")
  @ResponseStatus(HttpStatus.OK)
  public void reorderLists(
      @PathVariable Long boardId, @Valid @RequestBody ReorderBoardListsRequest request) {

    boardListService.reorderBoardLists(boardId, request);
  }

  @DeleteMapping("/{listId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteBoardList(@PathVariable Long boardId, @PathVariable Long listId) {

    boardListService.deleteBoardList(boardId, listId);
  }
}
