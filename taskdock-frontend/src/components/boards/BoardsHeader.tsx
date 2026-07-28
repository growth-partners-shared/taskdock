// THIRD PARTY
import { Plus } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";

interface BoardsHeaderProps {
  totalBoards: number;
  canCreateBoard: boolean;
  onCreateBoard: () => void;
}

export function BoardsHeader({
  totalBoards,
  canCreateBoard,
  onCreateBoard,
}: BoardsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Boards</h1>

        <p className="text-muted-foreground mt-1">
          There {totalBoards !== 1 ? "are" : "is"} {totalBoards} board
          {totalBoards !== 1 ? "s" : ""} available
        </p>
      </div>

      <Button onClick={onCreateBoard} disabled={!canCreateBoard}>
        <Plus className="mr-2 h-4 w-4" />
        Create Board
      </Button>
    </div>
  );
}
