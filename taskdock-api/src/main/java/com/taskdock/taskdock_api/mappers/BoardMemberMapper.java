package com.taskdock.taskdock_api.mappers;

import com.taskdock.taskdock_api.dtos.members.MemberResponse;
import com.taskdock.taskdock_api.dtos.members.UpdateMemberRoleRequest;
import com.taskdock.taskdock_api.entities.BoardMember;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BoardMemberMapper {

  public MemberResponse toMemberResponse(BoardMember member) {
    if (member == null) {
      return null;
    }

    return new MemberResponse(
        member.getId(),
        member.getUser().getId(),
        member.getUser().getEmail(),
        member.getUser().getFullName(),
        member.getRole(),
        member.getUser().getProfileImageUrl());
  }

  public List<MemberResponse> toMemberResponses(List<BoardMember> members) {
    if (members == null || members.isEmpty()) {
      return List.of();
    }

    return members.stream().map(this::toMemberResponse).toList();
  }

  public void updateMemberRoleFromRequest(UpdateMemberRoleRequest request, BoardMember member) {

    if (request == null || member == null) {
      return;
    }

    if (request.role() != null) {
      member.setRole(request.role());
    }
  }
}
