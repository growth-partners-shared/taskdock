// TYPES
import { BoardRole } from "./common.types";
import { MemberListResponse } from "./board-member.types";
import { TaskResponse } from "./task.types";

export type BoardColor =
  | "BLUE"
  | "GREEN"
  | "RED"
  | "ORANGE"
  | "PURPLE"
  | "PINK"
  | "YELLOW"
  | "GRAY";

export interface CreateBoardRequest {
  name: string;
  description?: string;
  color: BoardColor;
}

export interface UpdateBoardRequest {
  name?: string;
  description?: string;
  color?: BoardColor;
}

export interface BoardsResponse {
  boards: BoardResponse[];
  ownedBoards: number;
  maxOwnedBoards: number;
  sharedBoards: number;
  canCreateBoard: boolean;
}

export interface BoardResponse {
  id: number;
  name: string;
  description?: string;
  color: BoardColor;
  starred: boolean;
  createdAt: string;
  updatedAt: string;
  ownerName: string;
  currentUserRole: BoardRole;
  owner: boolean;
}

export interface BoardColorResponse {
  name: BoardColor;
  hexCode: string;
}

export interface BoardViewResponse {
  board: BoardResponse;
  members: MemberListResponse;
  lists: BoardListWithTasksResponse[];
}

export interface BoardListWithTasksResponse {
  id: number;
  name: string;
  position: number;
  tasks: TaskResponse[];
}
