import { useEffect, useMemo, useState } from "react";

// API
import { boardApi } from "@/api/board.api";

// COMPONENTS
import { BoardCard } from "@/components/boards/BoardCard";
import { BoardCardSkeleton } from "@/components/boards/BoardCardSkeleton";
import { BoardsHeader } from "@/components/boards/BoardsHeader";
import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog";
import { DeleteBoardDialog } from "@/components/boards/DeleteBoardDialog";
import { EditBoardDialog } from "@/components/boards/EditBoardDialog";
import { EmptyBoards } from "@/components/boards/EmptyBoards";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// LAYOUT
import { AppLayout } from "@/components/layout/AppLayout";

// THIRD PARTY
import { useNavigate } from "react-router-dom";

// TYPES
import { BoardsResponse, BoardResponse } from "@/types";
import { BoardTab } from "@/types/board-tab.types";

export default function BoardsDashboard() {
  const navigate = useNavigate();

  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  const [boardsResponse, setBoardsResponse] = useState<BoardsResponse | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState<BoardTab>("OWNED");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [editBoard, setEditBoard] = useState<BoardResponse | null>(null);

  const [deleteBoard, setDeleteBoard] = useState<BoardResponse | null>(null);

  const boards = boardsResponse?.boards ?? [];

  const starredBoards = useMemo(
    () => boards.filter((board) => board.starred),
    [boards],
  );

  const visibleBoards = useMemo(() => {
    switch (activeTab) {
      case "OWNED":
        return boards.filter((board) => board.owner);

      case "SHARED":
        return boards.filter((board) => !board.owner);

      case "STARRED":
        return starredBoards;

      default:
        return [];
    }
  }, [activeTab, boards, starredBoards]);

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards() {
    try {
      setLoading(true);

      const response = await boardApi.getAccessibleBoards();

      setBoardsResponse(response);
    } catch (error) {
      toast({
        title: "Failed to load boards",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <BoardsHeader
          totalBoards={boards.length}
          canCreateBoard={boardsResponse?.canCreateBoard ?? false}
          onCreateBoard={() => setCreateDialogOpen(true)}
        />

        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-2xl border bg-muted/40 p-2 shadow-sm">
            <button
              onClick={() => setActiveTab("OWNED")}
              className={`rounded-xl px-8 py-3 text-base font-semibold transition-all duration-200 ${
                activeTab === "OWNED"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground hover:bg-background/60"
              }`}
            >
              Owned ({boardsResponse?.ownedBoards ?? 0})
            </button>

            <button
              onClick={() => setActiveTab("SHARED")}
              className={`rounded-xl px-8 py-3 text-base font-semibold transition-all duration-200 ${
                activeTab === "SHARED"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground hover:bg-background/60"
              }`}
            >
              Shared ({boardsResponse?.sharedBoards ?? 0})
            </button>

            <button
              onClick={() => setActiveTab("STARRED")}
              className={`rounded-xl px-8 py-3 text-base font-semibold transition-all duration-200 ${
                activeTab === "STARRED"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground hover:bg-background/60"
              }`}
            >
              ⭐ Starred ({starredBoards.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BoardCardSkeleton key={index} />
            ))}
          </div>
        ) : visibleBoards.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onOpen={() => navigate(`/boards/${board.id}`)}
                onEdit={() => setEditBoard(board)}
                onDelete={() => setDeleteBoard(board)}
                onToggleStar={async () => {
                  try {
                    if (board.starred) {
                      await boardApi.unstarBoard(board.id);
                    } else {
                      await boardApi.starBoard(board.id);
                    }

                    await loadBoards();
                  } catch (error) {
                    toast({
                      title: "Failed",
                      description:
                        error instanceof Error
                          ? error.message
                          : "Unable to update board.",
                      variant: "destructive",
                    });
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyBoards
            tab={activeTab}
            canCreateBoard={boardsResponse?.canCreateBoard ?? false}
            onCreateBoard={() => setCreateDialogOpen(true)}
          />
        )}

        <CreateBoardDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={loadBoards}
        />

        {editBoard && (
          <EditBoardDialog
            board={editBoard}
            open
            onOpenChange={(open) => {
              if (!open) {
                setEditBoard(null);
              }
            }}
            onSuccess={() => {
              setEditBoard(null);
              loadBoards();
            }}
          />
        )}

        {deleteBoard && (
          <DeleteBoardDialog
            board={deleteBoard}
            open
            onOpenChange={(open) => {
              if (!open) {
                setDeleteBoard(null);
              }
            }}
            onSuccess={() => {
              setDeleteBoard(null);
              loadBoards();
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
