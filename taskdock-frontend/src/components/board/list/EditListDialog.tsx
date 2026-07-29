import { useEffect, useState } from "react";

//API
import { boardListApi } from "@/api/board-list.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Loader2 } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TYPES
import { BoardListWithTasksResponse } from "@/types";

interface Props {
  boardId: number;
  list: BoardListWithTasksResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditListDialog({
  boardId,
  list,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && list) {
      setName(list.name);
    }
  }, [open, list]);

  if (!list) return null;

  async function handleUpdate() {
    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);

      await boardListApi.updateBoardList(boardId, list.id, {
        name: name.trim(),
      });

      toast({
        title: "List updated",
        description: "Board list updated successfully.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to update list.",
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
          <DialogTitle>Edit List</DialogTitle>

          <DialogDescription>
            Update the workflow list name for this board.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>

            <Input
              id="name"
              placeholder="Todo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Enter a descriptive name for this board list.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleUpdate} disabled={loading || !name.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
