// THIRD PARTY
import { KanbanSquare, Plus } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";

interface EmptyBoardsProps {
  tab: string;
  canCreateBoard: boolean;
  onCreateBoard: () => void;
}

export function EmptyBoards({
  tab,
  canCreateBoard,
  onCreateBoard,
}: EmptyBoardsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <KanbanSquare className="h-10 w-10 text-muted-foreground" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold">No boards yet</h2>

      {tab === "OWNED" ? (
        <p className="mt-2 max-w-sm text-muted-foreground">
          Create your first board to organize tasks, and collaborate with your
          team.
        </p>
      ) : tab === "STARRED" ? (
        <p className="mt-2 max-w-sm text-muted-foreground">
          You haven't starred any boards yet. Star boards to quickly access.
        </p>
      ) : (
        <p className="mt-2 max-w-sm text-muted-foreground">
          Get Access to Collaborate with your team & manage tasks together.
        </p>
      )}

      {canCreateBoard && tab === "OWNED" ? (
        <Button className="mt-8" onClick={onCreateBoard}>
          <Plus className="mr-2 h-4 w-4" />
          Create your First Board
        </Button>
      ) : tab === "STARRED" ? (
        <p className="mt-8 text-sm text-muted-foreground">
          You haven't starred any boards yet.
        </p>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          You are not the owner of any boards.
        </p>
      )}
    </div>
  );
}
