// COMPONENTS
import { collisionDetectionStrategy } from "./collision";
import { TaskCard } from "../task/TaskCard";

// THIRD PARTY
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// TYPES
import { TaskResponse } from "@/types";
interface Props {
  children: React.ReactNode;

  activeTask: TaskResponse | null;

  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function DragContext({
  children,
  activeTask,
  onDragStart,
  onDragOver,
  onDragEnd,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-95">
            <TaskCard
              task={activeTask}
              canEdit={false}
              canDelete={false}
              onEdit={() => {}}
              onView={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
