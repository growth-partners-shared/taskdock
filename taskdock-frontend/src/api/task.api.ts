// TYPES
import {
  CreateBoardTaskRequest,
  MoveTaskRequest,
  TaskResponse,
  UpdateBoardTaskRequest,
} from "@/types";

// API
import { BASE_URL, getAuthHeaders } from "./common.api";
import { handleError } from "./api.utils";

export const taskApi = {
  // Create Task
  async createTask(
    boardId: number,
    request: CreateBoardTaskRequest,
  ): Promise<TaskResponse> {
    console.log("request", request);
    const response = await fetch(`${BASE_URL}/boards/${boardId}/tasks`, {
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

    return (await response.json()) as TaskResponse;
  },

  // Update Task
  async updateTask(
    boardId: number,
    taskId: number,
    request: UpdateBoardTaskRequest,
  ): Promise<TaskResponse> {
    console.log("request", request);
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/tasks/${taskId}`,
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

    return (await response.json()) as TaskResponse;
  },

  // Move Task
  async moveTask(
    boardId: number,
    taskId: number,
    request: MoveTaskRequest,
  ): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/tasks/${taskId}/move`,
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

  // Delete Task
  async deleteTask(boardId: number, taskId: number): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/boards/${boardId}/tasks/${taskId}`,
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
