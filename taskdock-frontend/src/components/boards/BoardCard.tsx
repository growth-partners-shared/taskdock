// THIRD PARTY
import { Calendar, Pencil, Star, Trash2, User } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// TYPES
import { BoardResponse } from "@/types";

const COLORS = {
  BLUE: "#3B82F6",
  GREEN: "#22C55E",
  RED: "#EF4444",
  ORANGE: "#F97316",
  PURPLE: "#A855F7",
  PINK: "#EC4899",
  YELLOW: "#EAB308",
  GRAY: "#6B7280",
};

interface Props {
  board: BoardResponse;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
}

export function BoardCard({
  board,
  onOpen,
  onEdit,
  onDelete,
  onToggleStar,
}: Props) {
  return (
    <Card
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="h-2"
        style={{
          backgroundColor: COLORS[board.color],
        }}
      />

      <div className="space-y-5 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{board.name}</h3>

              <Star
                size={20}
                onClick={(e) => {
                  e.stopPropagation();

                  if (board.currentUserRole === "OWNER") {
                    onToggleStar();
                  }
                }}
                fill={board.starred ? "currentColor" : "none"}
                className={`
    transition-colors duration-200
    ${board.starred ? "text-yellow-500" : "text-muted-foreground"}
    ${
      board.currentUserRole === "OWNER"
        ? "cursor-pointer hover:text-yellow-500"
        : "cursor-default"
    }
  `}
              />
            </div>

            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {board.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Owner + Role */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-2">
            <User size={15} className="text-muted-foreground" />

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Owner</span>

              <span className="text-sm font-medium">{board.ownerName}</span>
            </div>
          </div>

          <Badge
            variant={
              board.currentUserRole === "OWNER"
                ? "default"
                : board.currentUserRole === "EDITOR"
                  ? "secondary"
                  : "outline"
            }
          >
            {board.currentUserRole}
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>
              Updated {new Date(board.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {board.currentUserRole === "OWNER" && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil size={17} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 size={17} className="text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
