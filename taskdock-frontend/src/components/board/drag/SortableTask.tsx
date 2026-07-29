import { ReactNode } from "react";

// THIRD PARTY
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface Props {
  taskId: number;
  boardListId: number;
  children: ReactNode;
}

export function SortableTask({ taskId, boardListId, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,

    data: {
      type: "TASK",
      taskId,
      boardListId,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? "none" : "auto",
    zIndex: isDragging ? 999 : "auto",
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
