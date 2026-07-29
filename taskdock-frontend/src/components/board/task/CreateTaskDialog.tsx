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
import { CreateBoardTaskRequest, MemberResponse } from "@/types";

interface Props {
  boardListId?: number;
  boardId: number;
  members: MemberResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateTaskDialog({
  boardId,
  boardListId,
  members,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handleCreate(request: CreateBoardTaskRequest) {
    try {
      setLoading(true);

      await taskApi.createTask(boardId, {
        ...request,
        boardListId,
      });

      toast({
        title: "Task created",
        description: "Task created successfully.",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to create task.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <TaskForm
          mode="CREATE"
          boardListId={boardListId}
          members={members}
          loading={loading}
          submitLabel="Create Task"
          onSubmit={handleCreate}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
