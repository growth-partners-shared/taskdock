// THIRD PARTY
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

// TYPES
import { BoardListWithTasksResponse } from "@/types";

interface Props {
  index: number;
  list: BoardListWithTasksResponse;
}

export function ReorderListItem({ index, list }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "flex items-center justify-between rounded-xl border bg-background px-4 py-3 shadow-sm",
        "transition-all",
        isDragging
          ? "opacity-70 scale-[1.02] shadow-lg ring-2 ring-primary z-50"
          : "hover:bg-muted/40",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {index + 1}
        </div>

        <div>
          <p className="font-medium">{list.name}</p>

          <p className="text-xs text-muted-foreground">
            {list.tasks.length} {list.tasks.length === 1 ? "Task" : "Tasks"}
          </p>
        </div>
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab rounded-md p-2 text-muted-foreground transition hover:bg-muted active:cursor-grabbing"
        aria-label={`Drag ${list.name}`}
      >
        <GripVertical className="h-5 w-5" />
      </button>
    </div>
  );
}
