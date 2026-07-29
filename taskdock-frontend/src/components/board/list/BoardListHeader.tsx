// THIRD PARTY
import { Pencil, Trash2 } from "lucide-react";

// THIRD PARTY CCOMPONENTS
import { Button } from "@/components/ui/button";

// TYPES
import { BoardListWithTasksResponse } from "@/types";

interface Props {
  list: BoardListWithTasksResponse;
  taskCount: number;
  canEdit: boolean;
  onEdit?: () => void;
  canDelete: boolean;
  onDelete?: () => void;
}

export function BoardListHeader({
  list,
  taskCount,
  canEdit,
  onEdit,
  canDelete,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div>
        <h3 className="font-semibold">{list.name}</h3>

        <p className="text-xs text-muted-foreground">
          {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        {canEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {canDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}
