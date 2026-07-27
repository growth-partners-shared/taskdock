// TYPES
import {
  BoardColorResponse,
  BoardResponse,
  BoardsResponse,
  BoardViewResponse,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "@/types";

// API
import { BASE_URL, getAuthHeaders } from "./common.api";
import { handleError } from "./api.utils";

export const boardApi = {
  // Get Accessible Boards
  async getAccessibleBoards(): Promise<BoardsResponse> {
    const response = await fetch(`${BASE_URL}/boards`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardsResponse;
  },

  // Get Board View
  async getBoardView(boardId: number): Promise<BoardViewResponse> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}/view`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardViewResponse;
  },

  // Create Board
  async createBoard(request: CreateBoardRequest): Promise<BoardResponse> {
    const response = await fetch(`${BASE_URL}/boards`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardResponse;
  },

  // Update Board
  async updateBoard(
    boardId: number,
    request: UpdateBoardRequest,
  ): Promise<BoardResponse> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardResponse;
  },

  // Delete Board
  async deleteBoard(boardId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Star Board
  async starBoard(boardId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}/star`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Unstar Board
  async unstarBoard(boardId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/boards/${boardId}/unstar`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }
  },

  // Get Available Board Colors
  async getBoardColors(): Promise<BoardColorResponse[]> {
    const response = await fetch(`${BASE_URL}/boards/colors`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleError(response);
    }

    return (await response.json()) as BoardColorResponse[];
  },
};
