// TYPES
import {
  InviteMemberRequest,
  MemberResponse,
  UpdateMemberRoleRequest,
} from "@/types";

// API
import { BASE_URL, getAuthHeaders } from "./common.api";
import { handleError } from "./api.utils";

export const boardMemberApi = {
  // Invite Member
  async inviteMember(
    boardId: number,
    request: InviteMemberRequest,
  ): Promise<MemberResponse> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}/members`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as MemberResponse;
  },

  // Update Member Role
  async updateMemberRole(
    boardId: number,
    memberId: number,
    request: UpdateMemberRoleRequest,
  ): Promise<MemberResponse> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/members/${memberId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as MemberResponse;
  },

  // Remove Member
  async deleteMember(boardId: number, memberId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      await handleError(response);
    }
  },
};
