// COMPONENTS
import { Card } from "@/components/ui/card";
import { TaskPriorityBadge } from "./TaskPriorityBadge";

// THIRD PARTY
import { Calendar, MoreVertical, Pencil, Trash2, User } from "lucide-react";

// THIRD PARTY COMPONENTS
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TYPES
import { TaskResponse } from "@/types";

interface Props {
  task: TaskResponse;
  canEdit: boolean;
  canDelete: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({
  task,
  canEdit,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card
      className="cursor-pointer rounded-xl p-4 transition-shadow hover:shadow-md"
      onClick={onView}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold">{task.title}</h4>

            {task.description && (
              <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-md p-1 transition-colors hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
              )}

              {canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Priority & Due Date */}
        <div className="flex items-center justify-between">
          <TaskPriorityBadge priority={task.priority} />

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />

            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 border-t pt-3 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />

          <span className="truncate font-medium">
            {task.assigneeName ?? "Unassigned"}
          </span>
        </div>
      </div>
    </Card>
  );
}
