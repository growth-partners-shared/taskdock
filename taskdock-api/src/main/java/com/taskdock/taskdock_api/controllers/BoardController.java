package com.taskdock.taskdock_api.controllers;

import com.taskdock.taskdock_api.dtos.boards.*;
import com.taskdock.taskdock_api.services.BoardService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class BoardController {

  BoardService boardService;

  @PostMapping
  public ResponseEntity<BoardResponse> createBoard(@Valid @RequestBody CreateBoardRequest request) {

    return new ResponseEntity<>(boardService.createBoard(request), HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<BoardsResponse> getAccessibleBoards() {
    return ResponseEntity.ok(boardService.getAccessibleBoards());
  }

  @GetMapping("/{boardId}/view")
  public ResponseEntity<BoardViewResponse> getBoardView(@PathVariable Long boardId) {

    return ResponseEntity.ok(boardService.getBoardView(boardId));
  }

  @PatchMapping("/{boardId}")
  public ResponseEntity<BoardResponse> updateBoard(
      @PathVariable Long boardId, @Valid @RequestBody UpdateBoardRequest request) {

    return ResponseEntity.ok(boardService.updateBoard(boardId, request));
  }

  @DeleteMapping("/{boardId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteBoard(@PathVariable Long boardId) {

    boardService.deleteBoard(boardId);
  }

  @PatchMapping("/{boardId}/star")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void starBoard(@PathVariable Long boardId) {
    boardService.starBoard(boardId);
  }

  @PatchMapping("/{boardId}/unstar")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void unstarBoard(@PathVariable Long boardId) {
    boardService.unstarBoard(boardId);
  }

  @GetMapping("/colors")
  public ResponseEntity<List<BoardColorResponse>> getColors() {
    return ResponseEntity.ok(boardService.getColors());
  }
}
