// TYPES
import {
  BoardListResponse,
  CreateBoardListRequest,
  ReorderBoardListsRequest,
  UpdateBoardListRequest,
} from "@/types";

// API
import { BASE_URL, getAuthHeaders } from "./common.api";
import { handleError } from "./api.utils";

export const boardListApi = {
  // Create Board List
  async createBoardList(
    boardId: number,
    request: CreateBoardListRequest,
  ): Promise<BoardListResponse> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardListResponse;
  },

  // Update Board List
  async updateBoardList(
    boardId: number,
    listId: number,
    request: UpdateBoardListRequest,
  ): Promise<BoardListResponse> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/lists/${listId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardListResponse;
  },

  // Reorder Board Lists
  async reorderBoardLists(
    boardId: number,
    request: ReorderBoardListsRequest,
  ): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/lists/reorder`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Delete Board List
  async deleteBoardList(boardId: number, listId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/lists/${listId}`,
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
