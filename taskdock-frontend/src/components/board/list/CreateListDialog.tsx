import { useEffect, useState } from "react";

// API
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

interface Props {
  boardId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateListDialog({
  boardId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  async function handleCreate() {
    if (!name.trim()) {
      return;
    }

    try {
      setLoading(true);

      await boardListApi.createBoardList(boardId, {
        name: name.trim(),
      });

      toast({
        title: "List created",
        description: "New board list created successfully.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to create list.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create List</DialogTitle>

          <DialogDescription>
            Create a new workflow list for this board.
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

          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
