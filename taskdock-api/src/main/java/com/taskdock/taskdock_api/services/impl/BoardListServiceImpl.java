package com.taskdock.taskdock_api.services.impl;

import static com.taskdock.taskdock_api.utils.AppConstants.MAX_BOARD_LISTS;

import com.taskdock.taskdock_api.dtos.boardlists.*;
import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.BoardList;
import com.taskdock.taskdock_api.exceptions.BadRequestException;
import com.taskdock.taskdock_api.exceptions.ResourceNotFoundException;
import com.taskdock.taskdock_api.mappers.BoardListMapper;
import com.taskdock.taskdock_api.repositories.BoardListRepository;
import com.taskdock.taskdock_api.repositories.BoardRepository;
import com.taskdock.taskdock_api.services.BoardListService;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class BoardListServiceImpl implements BoardListService {

  BoardListMapper boardListMapper;
  BoardRepository boardRepository;
  BoardListRepository boardListRepository;

  @Override
  @PreAuthorize("@security.canEditBoard(#boardId)")
  public BoardListResponse createBoardList(Long boardId, CreateBoardListRequest request) {

    Board board = getBoard(boardId);

    if (boardListRepository.countByBoard(board) >= MAX_BOARD_LISTS) {
      throw new BadRequestException("Maximum " + MAX_BOARD_LISTS + " lists are allowed.");
    }

    if (boardListRepository.existsByBoardAndNameIgnoreCase(board, request.name())) {
      throw new BadRequestException("List with the same name already exists.");
    }

    BoardList list = boardListMapper.toEntity(request);

    list.setBoard(board);

    list.setPosition(boardListRepository.findMaxPositionByBoard(board) + 1);

    list = boardListRepository.save(list);

    return boardListMapper.toBoardListResponse(list);
  }

  @Override
  @PreAuthorize("@security.canViewBoard(#boardId)")
  public BoardListsResponse getBoardLists(Long boardId) {

    Board board = getBoard(boardId);

    List<BoardList> lists = boardListRepository.findAllByBoardOrderByPositionAsc(board);

    int listsCount = lists.size();

    List<BoardListResponse> responses = boardListMapper.toBoardListResponses(lists);

    return new BoardListsResponse(
        responses, listsCount, MAX_BOARD_LISTS, listsCount < MAX_BOARD_LISTS);
  }

  @Override
  @PreAuthorize("@security.canEditBoard(#boardId)")
  public BoardListResponse updateBoardList(
      Long boardId, Long listId, UpdateBoardListRequest request) {

    Board board = getBoard(boardId);

    BoardList list = getBoardList(board, listId);

    if (request.name() != null
        && boardListRepository.existsByBoardAndNameIgnoreCaseAndIdNot(
            board, request.name(), listId)) {

      throw new BadRequestException("List with the same name already exists.");
    }

    boardListMapper.updateBoardListFromRequest(request, list);

    list = boardListRepository.save(list);

    return boardListMapper.toBoardListResponse(list);
  }

  @Override
  @PreAuthorize("@security.canEditBoard(#boardId)")
  @Transactional
  public void reorderBoardLists(Long boardId, ReorderBoardListsRequest request) {

    Board board = getBoard(boardId);

    List<BoardList> lists = boardListRepository.findAllByBoardOrderByPositionAsc(board);

    Map<Long, BoardList> listMap = buildListMap(lists);

    validateReorderRequest(lists, listMap, request);

    moveListsToTemporaryPositions(lists);

    applyNewPositions(listMap, request);

    boardListRepository.saveAll(lists);
  }

  @Override
  @PreAuthorize("@security.canEditBoard(#boardId)")
  public void deleteBoardList(Long boardId, Long listId) {

    Board board = getBoard(boardId);

    BoardList list = getBoardList(board, listId);

    boardListRepository.delete(list);

    shiftPositionsAfterDeletion(board, list.getPosition());
  }

  // -----------------------------------------------------------------------------
  // Helper Methods
  // -----------------------------------------------------------------------------

  private Map<Long, BoardList> buildListMap(List<BoardList> lists) {
    return lists.stream().collect(Collectors.toMap(BoardList::getId, Function.identity()));
  }

  private void validateReorderRequest(
      List<BoardList> lists, Map<Long, BoardList> listMap, ReorderBoardListsRequest request) {

    if (request.lists().size() != lists.size()) {
      throw new BadRequestException("All lists must be reordered.");
    }

    Set<Long> listIds = new HashSet<>();
    Set<Integer> positions = new HashSet<>();

    for (ReorderBoardListRequest item : request.lists()) {

      if (!listIds.add(item.listId())) {
        throw new BadRequestException("Duplicate list id: " + item.listId());
      }

      if (!positions.add(item.newPosition())) {
        throw new BadRequestException("Duplicate position: " + item.newPosition());
      }

      if (item.newPosition() < 1 || item.newPosition() > lists.size()) {
        throw new BadRequestException("Invalid position: " + item.newPosition());
      }

      if (!listMap.containsKey(item.listId())) {
        throw new BadRequestException("Invalid list id: " + item.listId());
      }
    }
  }

  private void moveListsToTemporaryPositions(List<BoardList> lists) {

    for (BoardList list : lists) {
      list.setPosition(-list.getPosition());
    }

    boardListRepository.saveAll(lists);
    boardListRepository.flush();
  }

  private void applyNewPositions(Map<Long, BoardList> listMap, ReorderBoardListsRequest request) {

    for (ReorderBoardListRequest item : request.lists()) {

      BoardList list = listMap.get(item.listId());

      list.setPosition(item.newPosition());
    }
  }

  private void shiftPositionsAfterDeletion(Board board, int deletedPosition) {

    List<BoardList> remainingLists =
        boardListRepository.findAllByBoardAndPositionGreaterThanOrderByPositionAsc(
            board, deletedPosition);

    for (BoardList list : remainingLists) {
      list.setPosition(list.getPosition() - 1);
    }

    boardListRepository.saveAll(remainingLists);
  }

  private Board getBoard(Long boardId) {

    return boardRepository
        .findById(boardId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Board not found with id: ", boardId.toString()));
  }

  private BoardList getBoardList(Board board, Long listId) {

    return boardListRepository
        .findByIdAndBoard(listId, board)
        .orElseThrow(
            () -> new ResourceNotFoundException("List not found with id: ", listId.toString()));
  }
}
