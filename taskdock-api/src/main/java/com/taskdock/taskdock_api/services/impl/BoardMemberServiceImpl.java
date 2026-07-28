package com.taskdock.taskdock_api.services.impl;

import static com.taskdock.taskdock_api.utils.AppConstants.MAX_BOARD_MEMBERS;

import com.taskdock.taskdock_api.dtos.members.*;
import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.BoardMember;
import com.taskdock.taskdock_api.entities.User;
import com.taskdock.taskdock_api.enums.BoardRole;
import com.taskdock.taskdock_api.enums.UserStatus;
import com.taskdock.taskdock_api.exceptions.BadRequestException;
import com.taskdock.taskdock_api.exceptions.ResourceNotFoundException;
import com.taskdock.taskdock_api.mappers.BoardMemberMapper;
import com.taskdock.taskdock_api.repositories.BoardMemberRepository;
import com.taskdock.taskdock_api.repositories.BoardRepository;
import com.taskdock.taskdock_api.repositories.TaskRepository;
import com.taskdock.taskdock_api.repositories.UserRepository;
import com.taskdock.taskdock_api.utils.JwtAuthUtil;
import com.taskdock.taskdock_api.services.BoardMemberService;
import com.taskdock.taskdock_api.services.NotificationService;
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
public class BoardMemberServiceImpl implements BoardMemberService {

  BoardMemberMapper boardMemberMapper;
  NotificationService notificationService;
  BoardRepository boardRepository;
  BoardMemberRepository boardMemberRepository;
  UserRepository userRepository;
  TaskRepository taskRepository;
  JwtAuthUtil jwtAuthUtil;

  @Override
  @PreAuthorize("@security.canManageMembers(#boardId)")
  public MemberResponse inviteMember(Long boardId, InviteMemberRequest request) {

    Board board = getBoard(boardId);

    if (boardMemberRepository.countByBoard(board) >= MAX_BOARD_MEMBERS) {
      throw new BadRequestException("Maximum " + MAX_BOARD_MEMBERS + " members are allowed.");
    }

    User user =
        userRepository
            .findByEmail(request.email())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException("User not found with email: ", request.email()));

    user = getActiveUser(user.getId());

    if (board.getOwner().getId().equals(user.getId())) {
      throw new BadRequestException("Owner cannot be invited.");
    }

    if (boardMemberRepository.existsByBoardAndUser(board, user)) {
      throw new BadRequestException("User is already a member.");
    }

    BoardMember member = BoardMember.builder().board(board).user(user).role(request.role()).build();

    member = boardMemberRepository.save(member);

    notificationService.sendBoardInvitation(user, jwtAuthUtil.getCurrentUser(), board);
    return boardMemberMapper.toMemberResponse(member);
  }

  @Override
  @PreAuthorize("@security.canViewMembers(#boardId)")
  public MemberListResponse getBoardMembers(Long boardId) {

    Board board = getBoard(boardId);

    List<BoardMember> members = boardMemberRepository.findAllByBoard(board);

    int membersCount = members.size();

    return new MemberListResponse(
        boardMemberMapper.toMemberResponses(members),
        membersCount,
        MAX_BOARD_MEMBERS,
        membersCount < MAX_BOARD_MEMBERS);
  }

  @Override
  @PreAuthorize("@security.canManageMembers(#boardId)")
  public MemberResponse updateMemberRole(
      Long boardId, Long memberId, UpdateMemberRoleRequest request) {

    Board board = getBoard(boardId);

    BoardMember member =
        boardMemberRepository
            .findByIdAndBoard(memberId, board)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Member not found with id: ", memberId.toString()));

    if (member.getUser().getId().equals(board.getOwner().getId())) {
      throw new BadRequestException("Owner role cannot be changed.");
    }

    BoardRole oldRole = member.getRole();
    BoardRole newRole = request.role();

    // If member is becoming a VIEWER, remove all assigned tasks in this board.
    if (oldRole != BoardRole.VIEWER && newRole == BoardRole.VIEWER) {
      taskRepository.removeAssigneeFromTasksByBoard(boardId, member.getUser().getId());
    }

    member.setRole(newRole);

    member = boardMemberRepository.save(member);

    return boardMemberMapper.toMemberResponse(member);
  }

  @Override
  @PreAuthorize("@security.canManageMembers(#boardId)")
  public void deleteMember(Long boardId, Long memberId) {

    Board board = getBoard(boardId);

    BoardMember member =
        boardMemberRepository
            .findByIdAndBoard(memberId, board)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Member not found with id: ", memberId.toString()));

    if (member.getUser().getId().equals(board.getOwner().getId())) {
      throw new BadRequestException("Owner cannot be removed.");
    }

    taskRepository.removeAssigneeFromTasksByBoard(boardId, member.getUser().getId());

    boardMemberRepository.delete(member);
  }

  // -----------------------------------------------------------------------------
  // Helper Methods
  // -----------------------------------------------------------------------------

  private Board getBoard(Long boardId) {

    return boardRepository
        .findById(boardId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Board not found with id: ", boardId.toString()));
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
