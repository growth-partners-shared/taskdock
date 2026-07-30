import { ReactNode } from "react";

// THIRD PARTY
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface Props {
  taskId: number;
  boardListId: number;
  disabled: boolean;
  children: ReactNode;
}

export function SortableTask({
  taskId,
  boardListId,
  disabled,
  children,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    disabled,
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
    touchAction: disabled ? "auto" : "none",
    cursor: disabled ? "default" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!disabled ? attributes : {})}
      {...(!disabled ? listeners : {})}
    >
      {children}
    </div>
  );
}
