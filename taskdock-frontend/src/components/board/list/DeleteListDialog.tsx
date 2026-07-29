import { useState } from "react";

// API
import { boardListApi } from "@/api/board-list.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Loader2 } from "lucide-react";

// TYPES
import { BoardListWithTasksResponse } from "@/types";

// THIRD PART COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  boardId: number;
  list: BoardListWithTasksResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteListDialog({
  boardId,
  list,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  if (!list) return null;

  async function handleDelete() {
    try {
      setLoading(true);

      await boardListApi.deleteBoardList(boardId, list.id);

      toast({
        title: "List deleted",
        description: "Board list deleted successfully.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to delete list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete List</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete "{list.name}"? All tasks inside this
            list will also be removed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
