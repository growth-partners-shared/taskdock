// components/board/list/ReorderListsDialog.tsx

import { useEffect, useState } from "react";

// API
import { boardListApi } from "@/api/board-list.api";

// COMPONENTS
import { ReorderListItem } from "./ReorderListItem";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

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

// TYPES
import { BoardListWithTasksResponse } from "@/types";

interface Props {
  boardId: number;

  lists: BoardListWithTasksResponse[];

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onSuccess: () => void;
}

export function ReorderListsDialog({
  boardId,
  lists,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [orderedLists, setOrderedLists] = useState<
    BoardListWithTasksResponse[]
  >([]);

  useEffect(() => {
    setOrderedLists([...lists].sort((a, b) => a.position - b.position));
  }, [lists]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedLists((items) => {
      const oldIndex = items.findIndex((list) => list.id === Number(active.id));

      const newIndex = items.findIndex((list) => list.id === Number(over.id));

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  async function handleSave() {
    try {
      setLoading(true);

      await boardListApi.reorderBoardLists(boardId, {
        lists: orderedLists.map((list, index) => ({
          listId: list.id,
          newPosition: index + 1,
        })),
      });

      toast({
        title: "Columns reordered",
        description: "Board columns reordered successfully.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to reorder columns.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Reorder Board Lists</DialogTitle>

          <DialogDescription>
            Drag and drop board lists into the desired order.
          </DialogDescription>
        </DialogHeader>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedLists.map((list) => list.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="max-h-[420px] space-y-3 overflow-y-auto py-2">
              {orderedLists.map((list, index) => (
                <ReorderListItem key={list.id} list={list} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
