// COMPONENTS
import { TaskPriorityBadge } from "./TaskPriorityBadge";

// THIRD PARTY
import { Calendar, Clock, Pencil, Trash2, User } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// TYPES
import { TaskResponse } from "@/types";

interface Props {
  open: boolean;
  task: TaskResponse;
  canEdit: boolean;
  canDelete: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewTaskDialog({
  open,
  task,
  canEdit,
  canDelete,
  onOpenChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-3">
            <TaskPriorityBadge priority={task.priority} />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(task.dueDate).toLocaleString()}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">Description</h4>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          <Separator />

          {/* People */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                Assignee
              </p>

              <div className="flex items-center gap-3">
                {task.assigneeUserId ? (
                  <Avatar
                    key={task.assigneeUserId}
                    className="h-10 w-10 border border-border"
                  >
                    <AvatarImage
                      src={task.assigneeProfileImageUrl ?? undefined}
                      alt={task.assigneeName ?? "Assignee"}
                    />

                    <AvatarFallback>
                      {task.assigneeName
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase() ?? "NA"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <span className="font-medium">
                  {task.assigneeName ?? "Not assigned"}
                </span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                Created By
              </p>

              <div className="flex items-center gap-3">
                <Avatar
                  key={task.createdById}
                  className="h-10 w-10 border border-border"
                >
                  <AvatarImage
                    src={task.createdByProfileImageUrl ?? undefined}
                    alt={task.createdByName}
                  />

                  <AvatarFallback>
                    {task.createdByName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span className="font-medium">{task.createdByName}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Created</span>
              </div>

              <p className="mt-2 text-sm">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>

              <p className="mt-2 text-sm">
                {new Date(task.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>

            {canEdit && (
              <Button onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}

            {canDelete && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
