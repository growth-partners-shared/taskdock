// COMPONENTS
import { BoardListHeader } from "./BoardListHeader";
import { SortableBoardList } from "../drag/SortableBoardList";
import { SortableTask } from "../drag/SortableTask";
import { TaskCard } from "../task/TaskCard";

// THIRD PARTY
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// TYPES
import {
  BoardListWithTasksResponse,
  BoardRole,
  MemberResponse,
  TaskResponse,
} from "@/types";

interface Props {
  list: BoardListWithTasksResponse;
  members: MemberResponse[];
  isOwner: boolean;
  role: BoardRole;
  onViewTask: (task: TaskResponse) => void;
  onEditList: () => void;
  onDeleteList: () => void;
  onCreateTask: () => void;
  onEditTask: (task: TaskResponse) => void;
  onDeleteTask: (task: TaskResponse) => void;
}

export function BoardList({
  list,
  onEditList,
  onDeleteList,
  onCreateTask,
  onViewTask,
  onEditTask,
  onDeleteTask,
  isOwner,
  role,
}: Props) {
  return (
    <SortableBoardList id={list.id}>
      <div className="flex w-80 shrink-0 flex-col rounded-xl border bg-card shadow-sm">
        <BoardListHeader
          list={list}
          taskCount={list.tasks.length}
          onEdit={onEditList}
          canEdit={isOwner}
          onDelete={onDeleteList}
          canDelete={isOwner}
        />

        <SortableContext
          items={list.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 min-h-[120px]">
            {list.tasks.length === 0 ? (
              <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                No tasks yet
              </div>
            ) : (
              list.tasks.map((task) => (
                <SortableTask
                  key={task.id}
                  taskId={task.id}
                  boardListId={list.id}
                  disabled={role === "VIEWER"}
                >
                  <TaskCard
                    task={task}
                    canEdit={isOwner || role === "EDITOR"}
                    canDelete={isOwner || role === "EDITOR"}
                    onView={() => onViewTask(task)}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task)}
                  />
                </SortableTask>
              ))
            )}
          </div>
        </SortableContext>

        {role !== "VIEWER" && (
          <button
            onClick={onCreateTask}
            className="w-full rounded-md border border-dashed py-2 text-sm transition hover:bg-muted"
          >
            + Add Task
          </button>
        )}
      </div>
    </SortableBoardList>
  );
}
