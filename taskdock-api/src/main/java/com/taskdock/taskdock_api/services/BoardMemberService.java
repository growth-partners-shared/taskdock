package com.taskdock.taskdock_api.services;

import com.taskdock.taskdock_api.dtos.members.InviteMemberRequest;
import com.taskdock.taskdock_api.dtos.members.MemberListResponse;
import com.taskdock.taskdock_api.dtos.members.MemberResponse;
import com.taskdock.taskdock_api.dtos.members.UpdateMemberRoleRequest;

public interface BoardMemberService {

  MemberResponse inviteMember(Long boardId, InviteMemberRequest inviteMemberRequest);

  MemberListResponse getBoardMembers(Long boardId);

  MemberResponse updateMemberRole(
      Long boardId, Long memberId, UpdateMemberRoleRequest updateMemberRoleRequest);

  void deleteMember(Long boardId, Long memberId);
}
