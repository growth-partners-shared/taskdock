// THIRD PARTY
import {
  Collision,
  CollisionDetection,
  DroppableContainer,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";

function isBoardList(container: DroppableContainer) {
  return container.data.current?.type === "BOARD_LIST";
}

export const collisionDetectionStrategy: CollisionDetection = (args) => {
  // 1. Find collisions using the mouse pointer.
  const pointerCollisions = pointerWithin(args);

  const collisions =
    pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);

  // eslint-disable-next-line prefer-const
  let overId = getFirstCollision(collisions, "id");

  if (!overId) {
    return [];
  }

  const overContainer = args.droppableContainers.find(
    (container) => container.id === overId,
  );

  // If we're over an empty board list, return the list itself.
  if (overContainer && isBoardList(overContainer)) {
    return [
      {
        id: overId,
      } as Collision,
    ];
  }

  return collisions;
};
