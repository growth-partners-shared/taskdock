// THIRD PARTY
import { Loader2, Trash2 } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
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

interface Props {
  open: boolean;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function DeleteAccountDialog({
  open,
  loading,
  onOpenChange,
  onDelete,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>

          <AlertDialogDescription className="space-y-3">
            <p>This action cannot be undone.</p>

            <p>Deleting your account will permanently remove:</p>

            <ul className="list-disc space-y-1 pl-5">
              <li>Your profile</li>
              <li>Your boards and tasks</li>
              <li>Your memberships</li>
              <li>All associated data</li>
            </ul>

            <p className="font-medium text-destructive">
              This action is irreversible.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button variant="destructive" disabled={loading} onClick={onDelete}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!loading && <Trash2 className="mr-2 h-4 w-4" />}
              Delete Account
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
