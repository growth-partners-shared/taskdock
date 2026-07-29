import { ReactNode } from "react";

// THIRD PARTY
import { useDroppable } from "@dnd-kit/core";

interface Props {
  id: number;
  children: ReactNode;
}

export function SortableBoardList({ id, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id,

    data: {
      type: "BOARD_LIST",
      boardListId: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={
        isOver
          ? "rounded-xl ring-2 ring-primary transition-all"
          : "transition-all"
      }
    >
      {children}
    </div>
  );
}
