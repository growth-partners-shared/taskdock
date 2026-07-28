// THIRD PARTY
import { KanbanSquare } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/boards" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <KanbanSquare className="h-5 w-5" />
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight">TaskDock</span>

        <span className="text-xs text-muted-foreground">
          Collaborate to Improve your Workflows.
        </span>
      </div>
    </Link>
  );
}
