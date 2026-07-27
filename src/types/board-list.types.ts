export interface CreateBoardListRequest {
  name: string;
}

export interface UpdateBoardListRequest {
  name?: string;
}

export interface BoardListResponse {
  id: number;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardListsResponse {
  lists: BoardListResponse[];
  totalLists: number;
  maxTotalLists: number;
  canCreateList: boolean;
}

export interface ReorderBoardListRequest {
  listId: number;
  newPosition: number;
}

export interface ReorderBoardListsRequest {
  lists: ReorderBoardListRequest[];
}
