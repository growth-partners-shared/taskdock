package com.taskdock.taskdock_api.services.impl;

import static com.taskdock.taskdock_api.utils.AppConstants.MAX_BOARDS_PER_USER;

import com.taskdock.taskdock_api.dtos.boardlists.BoardListsResponse;
import com.taskdock.taskdock_api.dtos.boards.*;
import com.taskdock.taskdock_api.dtos.members.MemberListResponse;
import com.taskdock.taskdock_api.dtos.tasks.TaskListResponse;
import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.BoardMember;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.enums.BoardColor;
import com.taskdock.taskdock_api.enums.BoardRole;
import com.taskdock.taskdock_api.exceptions.BadRequestException;
import com.taskdock.taskdock_api.exceptions.ResourceNotFoundException;
import com.taskdock.taskdock_api.mappers.BoardMapper;
import com.taskdock.taskdock_api.repositories.BoardMemberRepository;
import com.taskdock.taskdock_api.repositories.BoardRepository;
import com.taskdock.taskdock_api.utils.JwtAuthUtil;
import com.taskdock.taskdock_api.services.BoardListService;
import com.taskdock.taskdock_api.services.BoardMemberService;
import com.taskdock.taskdock_api.services.BoardService;
import com.taskdock.taskdock_api.services.TaskService;
import java.util.*;
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
public class BoardServiceImpl implements BoardService {

  BoardMapper boardMapper;
  BoardMemberService boardMemberService;
  BoardListService boardListService;
  TaskService taskService;
  BoardRepository boardRepository;
  BoardMemberRepository boardMemberRepository;
  JwtAuthUtil jwtAuthUtil;

  @Override
  public BoardResponse createBoard(CreateBoardRequest request) {

    User currentUser = jwtAuthUtil.getCurrentUser();

    long ownedBoards = boardRepository.countByOwner(currentUser);

    if (ownedBoards >= MAX_BOARDS_PER_USER) {
      throw new BadRequestException(
          "Free plan allows a maximum of " + MAX_BOARDS_PER_USER + " boards.");
    }

    if (boardRepository.existsByOwnerAndNameIgnoreCase(currentUser, request.name())) {

      throw new BadRequestException("Board with the same name already exists.");
    }

    Board board = boardMapper.toEntity(request);
    board.setOwner(currentUser);

    board = boardRepository.save(board);

    BoardMember ownerMember =
        BoardMember.builder().board(board).user(currentUser).role(BoardRole.OWNER).build();

    boardMemberRepository.save(ownerMember);

    return toBoardResponse(
        board, ownerMember.getRole(), board.getOwner().getId().equals(currentUser.getId()));
  }

  @Override
  public BoardsResponse getAccessibleBoards() {

    User currentUser = jwtAuthUtil.getCurrentUser();

    List<Board> ownedBoards = boardRepository.findAllByOwner(currentUser);

    List<BoardMember> memberships = boardMemberRepository.findAllByUser(currentUser);

    Map<Long, Board> accessibleBoards = new LinkedHashMap<>();

    ownedBoards.forEach(board -> accessibleBoards.put(board.getId(), board));

    memberships.stream()
        .map(BoardMember::getBoard)
        .forEach(board -> accessibleBoards.putIfAbsent(board.getId(), board));

    long ownedCount = boardRepository.countByOwner(currentUser);

    List<BoardResponse> responses =
        accessibleBoards.values().stream()
            .map(
                board -> {
                  BoardMember member = getBoardMember(board, currentUser);

                  return toBoardResponse(
                      board,
                      member.getRole(),
                      board.getOwner().getId().equals(currentUser.getId()));
                })
            .toList();

    return new BoardsResponse(
        responses,
        ownedBoards.size(),
        MAX_BOARDS_PER_USER,
        responses.size() - ownedBoards.size(),
        ownedCount < MAX_BOARDS_PER_USER);
  }

  @Override
  @PreAuthorize("@security.canViewBoard(#boardId)")
  public BoardViewResponse getBoardView(Long boardId) {

    User currentUser = jwtAuthUtil.getCurrentUser();

    // Get Board Details
    Board board = getAccessibleBoard(boardId);

    BoardMember member = getBoardMember(board, currentUser);

    // Get Board Members
    MemberListResponse members = boardMemberService.getBoardMembers(boardId);

    // Get BoardLists
    BoardListsResponse boardLists = boardListService.getBoardLists(boardId);

    // Build lists with tasks
    List<BoardListWithTasksResponse> lists =
        boardLists.lists().stream()
            .map(
                list -> {
                  TaskListResponse tasks = taskService.getTasksByBoardList(boardId, list.id());

                  return new BoardListWithTasksResponse(
                      list.id(), list.name(), list.position(), tasks.tasks());
                })
            .toList();

    return new BoardViewResponse(
        toBoardResponse(
            board, member.getRole(), board.getOwner().getId().equals(currentUser.getId())),
        members,
        lists);
  }

  @Override
  @PreAuthorize("@security.canEditBoard(#boardId)")
  public BoardResponse updateBoard(Long boardId, UpdateBoardRequest request) {

    User currentUser = jwtAuthUtil.getCurrentUser();

    Board board = getOwnedBoard(boardId);

    if (request.name() != null
        && boardRepository.existsByOwnerAndNameIgnoreCaseAndIdNot(
            currentUser, request.name(), boardId)) {

      throw new BadRequestException("Board with the same name already exists.");
    }

    boardMapper.updateBoardFromRequest(request, board);

    board = boardRepository.save(board);

    BoardMember ownerMember = getBoardMember(board, currentUser);

    return toBoardResponse(
        board, ownerMember.getRole(), board.getOwner().getId().equals(currentUser.getId()));
  }

  @Override
  @PreAuthorize("@security.canDeleteBoard(#boardId)")
  public void deleteBoard(Long boardId) {

    Board board = getOwnedBoard(boardId);

    boardRepository.delete(board);
  }

  @Override
  public List<BoardColorResponse> getColors() {

    return Arrays.stream(BoardColor.values())
        .map(color -> new BoardColorResponse(color.name(), color.getHexCode()))
        .toList();
  }

  @Override
  public void starBoard(Long boardId) {

    Board board = getOwnedBoard(boardId);

    board.setStarred(true);

    boardRepository.save(board);
  }

  @Override
  public void unstarBoard(Long boardId) {

    Board board = getOwnedBoard(boardId);

    board.setStarred(false);

    boardRepository.save(board);
  }

  // -----------------------------------------------------------------------------
  // Helper Methods
  // -----------------------------------------------------------------------------

  private Board getAccessibleBoard(Long boardId) {

    return boardRepository
        .findById(boardId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Board not found with id: ", boardId.toString()));
  }

  private Board getOwnedBoard(Long boardId) {

    User currentUser = jwtAuthUtil.getCurrentUser();

    return boardRepository
        .findByIdAndOwner(boardId, currentUser)
        .orElseThrow(
            () -> new ResourceNotFoundException("Board not found with id: ", boardId.toString()));
  }

  private BoardMember getBoardMember(Board board, User user) {
    return boardMemberRepository
        .findByBoardAndUser(board, user)
        .orElseThrow(
            () -> new ResourceNotFoundException("Board member not found", user.getEmail()));
  }

  private BoardResponse toBoardResponse(Board board, BoardRole role, boolean isOwner) {
    return new BoardResponse(
        board.getId(),
        board.getName(),
        board.getDescription(),
        board.getColor(),
        board.isStarred(),
        board.getCreatedAt(),
        board.getUpdatedAt(),
        board.getOwner().getFullName(),
        role,
        isOwner);
  }
}
