import { useState } from "react";

// API
import { boardApi } from "@/api/board.api";

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
import { BoardResponse } from "@/types/board.types";

interface Props {
  board: BoardResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteBoardDialog({
  board,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await boardApi.deleteBoard(board.id);

      onSuccess();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Board?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete <strong>{board.name}</strong>?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
