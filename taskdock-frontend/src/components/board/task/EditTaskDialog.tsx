import { useState } from "react";

// API
import { taskApi } from "@/api/task.api";

// COMPONENTS
import { TaskForm } from "./TaskForm";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TYPES
import { MemberResponse, TaskResponse, UpdateBoardTaskRequest } from "@/types";

interface Props {
  boardId: number;
  task: TaskResponse | null;
  members: MemberResponse[];

  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTaskDialog({
  boardId,
  task,
  members,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handleUpdate(request: UpdateBoardTaskRequest) {
    try {
      setLoading(true);

      await taskApi.updateTask(boardId, task.id, request);

      toast({
        title: "Task updated",
        description: "Changes saved successfully.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to update task.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <TaskForm
          mode="EDIT"
          initialValues={{
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            assigneeUserId: task.assigneeUserId,
          }}
          members={members}
          loading={loading}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
