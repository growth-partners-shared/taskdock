// TYPES
import { BoardRole } from "./common.types";

export interface MemberResponse {
  memberId: number;
  userId: number;
  email: string;
  fullName: string;
  role: BoardRole;
  profileImageUrl?: string;
}

export interface MemberListResponse {
  members: MemberResponse[];
  totalMembers: number;
  maxMembers: number;
  canInviteMember: boolean;
}

export interface InviteMemberRequest {
  email: string;
  role: BoardRole;
}

export interface UpdateMemberRoleRequest {
  role: BoardRole;
}
