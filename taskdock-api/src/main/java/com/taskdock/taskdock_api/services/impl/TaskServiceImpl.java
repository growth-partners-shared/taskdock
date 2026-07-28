package com.taskdock.taskdock_api.services.impl;

import com.taskdock.taskdock_api.dtos.tasks.*;
import com.taskdock.taskdock_api.entities.*;
import com.taskdock.taskdock_api.enums.BoardRole;
import com.taskdock.taskdock_api.enums.TaskPriority;
import com.taskdock.taskdock_api.enums.UserStatus;
import com.taskdock.taskdock_api.exceptions.BadRequestException;
import com.taskdock.taskdock_api.exceptions.ResourceNotFoundException;
import com.taskdock.taskdock_api.mappers.TaskMapper;
import com.taskdock.taskdock_api.repositories.*;
import com.taskdock.taskdock_api.services.NotificationService;
import com.taskdock.taskdock_api.services.TaskService;
import com.taskdock.taskdock_api.utils.JwtAuthUtil;
import java.util.List;
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
public class TaskServiceImpl implements TaskService {

  TaskMapper taskMapper;
  NotificationService notificationService;
  TaskRepository taskRepository;
  BoardRepository boardRepository;
  BoardListRepository boardListRepository;
  BoardMemberRepository boardMemberRepository;
  UserRepository userRepository;
  JwtAuthUtil jwtAuthUtil;

  @Override
  @PreAuthorize("@security.canCreateTask(#boardId)")
  public TaskResponse createTask(Long boardId, CreateTaskRequest request) {

    Board board = getBoard(boardId);

    BoardList boardList = getBoardList(board, request.boardListId());

    Task task = taskMapper.toEntity(request);

    task.setBoardList(boardList);

    User currentUser = jwtAuthUtil.getCurrentUser();

    task.setCreatedBy(currentUser);

    task.setAssignee(resolveAssignee(board, request.assigneeUserId()));

    task.setPriority(request.priority() != null ? request.priority() : TaskPriority.MEDIUM);

    task.setPosition(getNextTaskPosition(boardList));

    task = taskRepository.save(task);

    if (task.getAssignee() != null) {
      notificationService.sendTaskAssignedNotification(task.getAssignee(), currentUser, task);
    }

    return taskMapper.toTaskResponse(task);
  }

  @Override
  @PreAuthorize("@security.canViewTask(#boardId)")
  public TaskListResponse getTasksByBoardList(Long boardId, Long listId) {

    Board board = getBoard(boardId);

    BoardList boardList =
        boardListRepository
            .findByIdAndBoard(listId, board)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Board list not found with id: ", listId.toString()));

    List<Task> tasks = taskRepository.findAllByBoardListOrderByPositionAsc(boardList);

    List<TaskResponse> responses = taskMapper.toTaskResponses(tasks);

    return new TaskListResponse(responses, responses.size());
  }

  @Override
  @PreAuthorize("@security.canUpdateTask(#boardId)")
  public TaskResponse updateTask(Long boardId, Long taskId, UpdateTaskRequest request) {

    Task task = getTaskEntity(boardId, taskId);

    taskMapper.updateTaskFromRequest(request, task);

    Board board = getBoard(boardId);

    User currentUser = jwtAuthUtil.getCurrentUser();

    User previousAssignee = task.getAssignee();

    if (request.assigneeUserId() != null) {

      User newAssignee = validateAssignee(board, request.assigneeUserId());

      task.setAssignee(newAssignee);

      if (previousAssignee == null || !previousAssignee.getId().equals(newAssignee.getId())) {

        notificationService.sendTaskAssignedNotification(newAssignee, currentUser, task);
      }
    }

    task = taskRepository.save(task);

    return taskMapper.toTaskResponse(task);
  }

  @Override
  @PreAuthorize("@security.canUpdateTask(#boardId)")
  public void moveTask(Long boardId, Long taskId, MoveTaskRequest request) {

    Board board = getBoard(boardId);

    Task task = getTaskEntity(boardId, taskId);

    BoardList sourceList = task.getBoardList();

    BoardList destinationList = getBoardList(board, request.destinationListId());

    if (sourceList.getId().equals(destinationList.getId())) {
      return;
    }

    int oldPosition = task.getPosition();

    int newPosition = getNextTaskPosition(destinationList);

    task.setBoardList(destinationList);
    task.setPosition(newPosition);

    taskRepository.saveAndFlush(task);

    compactTaskPositions(sourceList, oldPosition);
  }

  @Override
  @PreAuthorize("@security.canDeleteTask(#boardId)")
  public void deleteTask(Long boardId, Long taskId) {

    Task task = getTaskEntity(boardId, taskId);

    BoardList boardList = task.getBoardList();

    int deletedPosition = task.getPosition();

    taskRepository.delete(task);

    compactTaskPositions(boardList, deletedPosition);
  }

  // -----------------------------------------------------------------------------
  // Helper Methods
  // -----------------------------------------------------------------------------

  private User resolveAssignee(Board board, Long assigneeUserId) {
    if (assigneeUserId == null) {
      return board.getOwner();
    }

    return validateAssignee(board, assigneeUserId);
  }

  private Board getBoard(Long boardId) {

    return boardRepository
        .findById(boardId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Board not found with id: ", boardId.toString()));
  }

  private Task getTaskEntity(Long boardId, Long taskId) {

    return taskRepository
        .findByIdAndBoardListBoardId(taskId, boardId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Task not found with id: ", taskId.toString()));
  }

  private int getNextTaskPosition(BoardList boardList) {
    return java.util.Optional.ofNullable(taskRepository.findMaxPosition(boardList))
        .map(position -> position + 1)
        .orElse(1);
  }

  /** Closes the position gap after a task is deleted or moved. */
  private void compactTaskPositions(BoardList boardList, int deletedPosition) {

    List<Task> tasks =
        taskRepository.findAllByBoardListAndPositionGreaterThanOrderByPositionAsc(
            boardList, deletedPosition);

    for (Task task : tasks) {
      task.setPosition(task.getPosition() - 1);
    }

    taskRepository.saveAll(tasks);
  }

  private BoardList getBoardList(Board board, Long listId) {

    if (listId == null) {
      throw new BadRequestException("Board list is required.");
    }

    BoardList boardList =
        boardListRepository
            .findByIdAndBoard(listId, board)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Board list not found with id: ", listId.toString()));

    return boardList;
  }

  private User validateAssignee(Board board, Long assigneeUserId) {

    User assignee = getActiveUser(assigneeUserId);

    // Board owner can always be assigned
    if (board.getOwner().getId().equals(assignee.getId())) {
      return assignee;
    }

    BoardMember member =
        boardMemberRepository
            .findByBoardAndUser(board, assignee)
            .orElseThrow(() -> new BadRequestException("User is not a member of this board."));

    if (member.getRole() == BoardRole.VIEWER) {
      throw new BadRequestException("Viewer cannot be assigned tasks.");
    }

    return assignee;
  }

  private User getActiveUser(Long userId) {

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: ", userId.toString()));

    if (user.getStatus() != UserStatus.ACTIVE) {
      throw new BadRequestException("User account is inactive.");
    }

    return user;
  }
}
