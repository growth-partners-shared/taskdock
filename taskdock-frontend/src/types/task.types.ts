export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "HIGHEST";

export interface CreateBoardTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate: string;
  assigneeUserId?: number;
  boardListId: number;
}

export interface UpdateBoardTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeUserId?: number;
}

export interface MoveTaskRequest {
  destinationListId: number;
}

export interface TaskResponse {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  position: number;
  boardListId: number;
  assigneeUserId: number;
  assigneeName: string;
  assigneeProfileImageUrl?: string;
  createdById: number;
  createdByName: string;
  createdByProfileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListResponse {
  tasks: TaskResponse[];
  totalTasks: number;
}
