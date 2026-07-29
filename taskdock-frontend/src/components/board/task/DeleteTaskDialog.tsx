import { useState } from "react";

// API
import { taskApi } from "@/api/task.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY COMPONENTS
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// TYPES
import { TaskResponse } from "@/types";
interface Props {
  boardId: number;
  task: TaskResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteTaskDialog({
  boardId,
  task,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      await taskApi.deleteTask(boardId, task.id);

      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted successfully.`,
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to delete task.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{task.title}"</span>?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
