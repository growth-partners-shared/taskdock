import { useEffect, useState } from "react";

// API
import { boardApi } from "@/api/board.api";
import { taskApi } from "@/api/task.api";

// COMPONENTS
import { AddListButton } from "@/components/board/list/AddListButton";
import { BoardHeader } from "@/components/board/BoardHeader";
import { BoardList } from "@/components/board/list/BoardList";
import { CreateListDialog } from "@/components/board/list/CreateListDialog";
import { CreateTaskDialog } from "@/components/board/task/CreateTaskDialog";
import { DeleteListDialog } from "@/components/board/list/DeleteListDialog";
import { DeleteTaskDialog } from "@/components/board/task/DeleteTaskDialog";
import { EditListDialog } from "@/components/board/list/EditListDialog";
import { EditTaskDialog } from "@/components/board/task/EditTaskDialog";
import { InviteMemberDialog } from "@/components/board/member/InviteMemberDialog";
import { MembersDrawer } from "@/components/board/member/MembersDrawer";
import { ReorderListsDialog } from "@/components/board/list/ReorderListDialog";
import { ViewTaskDialog } from "@/components/board/task/ViewTaskDialog";

// LAYOUTS
import { AppLayout } from "@/components/layout/AppLayout";

// THIRD PARTY
import { DragContext } from "@/components/board/drag/DragContext";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

// TYPES
import {
  BoardViewResponse,
  BoardListWithTasksResponse,
  TaskResponse,
} from "@/types";

export default function BoardView() {
  const { boardId } = useParams();

  const [loading, setLoading] = useState(true);

  const [boardView, setBoardView] = useState<BoardViewResponse | null>(null);

  const [lists, setLists] = useState<BoardListWithTasksResponse[]>([]);

  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);

  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);

  const [selectedList, setSelectedList] =
    useState<BoardListWithTasksResponse | null>(null);

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

  const [createListOpen, setCreateListOpen] = useState(false);

  const [editListOpen, setEditListOpen] = useState(false);

  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const [editTaskOpen, setEditTaskOpen] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);

  const [membersOpen, setMembersOpen] = useState(false);

  const [dragSourceListId, setDragSourceListId] = useState<number | null>(null);

  const [deleteListOpen, setDeleteListOpen] = useState(false);

  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);

  const [viewTaskOpen, setViewTaskOpen] = useState(false);

  async function loadBoard() {
    if (!boardId) return;

    try {
      setLoading(true);

      const response = await boardApi.getBoardView(Number(boardId));

      setBoardView(response);

      // Updated because lists is now BoardListsResponse
      setLists(response.lists.lists);
    } finally {
      setLoading(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type !== "TASK") {
      return;
    }

    const taskId = Number(event.active.id);

    for (const list of lists) {
      const task = list.tasks.find((t) => t.id === taskId);

      if (task) {
        setActiveTask({
          ...task,
        });

        setDragSourceListId(list.id);

        break;
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = Number(active.id);

    setLists((previous) => {
      const next = previous.map((list) => ({
        ...list,
        tasks: [...list.tasks],
      }));

      const source = next.find((list) =>
        list.tasks.some((task) => task.id === taskId),
      );

      if (!source) {
        return previous;
      }

      let destination: BoardListWithTasksResponse | undefined;

      if (over.data.current?.type === "BOARD_LIST") {
        destination = next.find(
          (list) => list.id === Number(over.data.current.boardListId),
        );
      } else {
        destination = next.find((list) =>
          list.tasks.some((task) => task.id === Number(over.id)),
        );
      }

      if (!destination) {
        return previous;
      }

      if (source.id === destination.id) {
        return previous;
      }

      const index = source.tasks.findIndex((task) => task.id === taskId);

      const [movingTask] = source.tasks.splice(index, 1);

      movingTask.boardListId = destination.id;

      destination.tasks.push(movingTask);

      return next;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over || !boardId || dragSourceListId == null) {
      setDragSourceListId(null);

      return;
    }

    let destinationListId: number;

    if (over.data.current?.type === "BOARD_LIST") {
      destinationListId = Number(over.data.current.boardListId);
    } else {
      destinationListId = Number(over.data.current.boardListId);
    }

    if (dragSourceListId === destinationListId) {
      setDragSourceListId(null);

      return;
    }

    try {
      await taskApi.moveTask(Number(boardId), Number(active.id), {
        destinationListId,
      });
    } catch (error) {
      console.error(error);

      await loadBoard();
    } finally {
      setDragSourceListId(null);
    }
  }

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!boardView) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          Board not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DragContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        activeTask={activeTask}
      >
        <div className="flex h-full flex-col">
          <BoardHeader
            board={boardView.board}
            members={boardView.members}
            onInvite={() => setInviteOpen(true)}
            onMembers={() => setMembersOpen(true)}
            onReorderLists={() => setReorderDialogOpen(true)}
          />

          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex min-w-max gap-5 p-6 items-start">
              {lists.map((list) => (
                <BoardList
                  key={list.id}
                  list={list}
                  members={boardView.members.members}
                  onEditList={() => {
                    setSelectedList(list);

                    setEditListOpen(true);
                  }}
                  onCreateTask={() => {
                    setSelectedList(list);

                    setCreateTaskOpen(true);
                  }}
                  onViewTask={(task) => {
                    setSelectedTask(task);
                    setViewTaskOpen(true);
                  }}
                  onEditTask={(task) => {
                    setSelectedTask(task);
                    setEditTaskOpen(true);
                  }}
                  onDeleteTask={(task) => {
                    setSelectedTask(task);
                    setDeleteTaskOpen(true);
                  }}
                  onDeleteList={() => {
                    setSelectedList(list);
                    setDeleteListOpen(true);
                  }}
                  isOwner={boardView.board.owner}
                  role={boardView.board.currentUserRole}
                />
              ))}

              {boardView.lists.canCreateList && (
                <AddListButton
                  onClick={() => setCreateListOpen(true)}
                  owner={boardView.board.owner}
                />
              )}
            </div>
          </div>
        </div>
      </DragContext>

      {/* Lists */}

      <CreateListDialog
        boardId={Number(boardId)}
        open={createListOpen}
        onOpenChange={setCreateListOpen}
        onSuccess={loadBoard}
      />

      {selectedList && (
        <EditListDialog
          boardId={Number(boardId)}
          list={selectedList}
          open={editListOpen}
          onOpenChange={(open) => {
            setEditListOpen(open);

            if (!open) {
              setSelectedList(null);
            }
          }}
          onSuccess={loadBoard}
        />
      )}

      {selectedList && (
        <DeleteListDialog
          boardId={Number(boardId)}
          list={selectedList}
          open={deleteListOpen}
          onOpenChange={(open) => {
            setDeleteListOpen(open);

            if (!open) {
              setSelectedList(null);
            }
          }}
          onSuccess={loadBoard}
        />
      )}

      {/* Tasks */}

      {selectedTask && (
        <ViewTaskDialog
          open={viewTaskOpen}
          task={selectedTask}
          canEdit={boardView.board.currentUserRole !== "VIEWER"}
          canDelete={boardView.board.currentUserRole !== "VIEWER"}
          onOpenChange={(open) => {
            setViewTaskOpen(open);

            if (!open && !editTaskOpen && !deleteTaskOpen) {
              setSelectedTask(null);
            }
          }}
          onEdit={() => {
            setViewTaskOpen(false);
            setEditTaskOpen(true);
          }}
          onDelete={() => {
            setViewTaskOpen(false);
            setDeleteTaskOpen(true);
          }}
        />
      )}

      <CreateTaskDialog
        boardId={Number(boardId)}
        boardListId={selectedList?.id}
        members={boardView.members.members}
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onSuccess={loadBoard}
      />

      {selectedTask && (
        <EditTaskDialog
          boardId={Number(boardId)}
          task={selectedTask}
          members={boardView.members.members}
          open={editTaskOpen}
          onOpenChange={(open) => {
            setEditTaskOpen(open);

            if (!open) {
              setSelectedTask(null);
            }
          }}
          onSuccess={loadBoard}
        />
      )}

      {selectedTask && (
        <DeleteTaskDialog
          boardId={Number(boardId)}
          task={selectedTask}
          open={deleteTaskOpen}
          onOpenChange={(open) => {
            setDeleteTaskOpen(open);

            if (!open) {
              setSelectedTask(null);
            }
          }}
          onSuccess={loadBoard}
        />
      )}

      {/* Members */}

      <InviteMemberDialog
        boardId={Number(boardId)}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSuccess={loadBoard}
      />

      <MembersDrawer
        boardId={Number(boardId)}
        owner={boardView.board.owner}
        members={boardView.members}
        open={membersOpen}
        onOpenChange={setMembersOpen}
        onSuccess={loadBoard}
        onInvite={() => setInviteOpen(true)}
      />

      {/* Reorder */}

      <ReorderListsDialog
        boardId={Number(boardId)}
        lists={lists}
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        onSuccess={loadBoard}
      />
    </AppLayout>
  );
}
