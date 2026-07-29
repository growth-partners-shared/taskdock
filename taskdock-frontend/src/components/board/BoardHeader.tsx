// COMPONENTS
import { MembersAvatarGroup } from "./MembersAvatarGroup";

// THIRD PARTY
import { Calendar, Settings, Star, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// THIRD PARTY COMPONENTS
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TYPES
import { BoardResponse, MemberListResponse } from "@/types";

interface Props {
  board: BoardResponse;
  members: MemberListResponse;

  onInvite?: () => void;
  onMembers?: () => void;
  onReorderLists?: () => void;
}

export function BoardHeader({
  board,
  members,
  onInvite,
  onMembers,
  onReorderLists,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      {/* Top Navigation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/boards")}
        className="mb-5 h-8 px-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Boards
      </Button>

      <div className="flex items-start justify-between gap-6">
        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>

            {board.starred && (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            )}
          </div>

          {board.description && (
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {board.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              <Calendar className="mr-1 h-3 w-3" />
              Created {new Date(board.createdAt).toLocaleDateString()}
            </Badge>

            <Badge variant="outline">
              <Users className="mr-1 h-3 w-3" />
              {members.members.length}{" "}
              {members.members.length === 1 ? "Member" : "Members"}
            </Badge>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMembers}
            className="rounded-lg transition-opacity hover:opacity-80"
          >
            <MembersAvatarGroup members={members.members} />
          </button>

          <Button disabled={!board.owner} onClick={onInvite}>
            Invite
          </Button>

          {board.owner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onMembers}>
                  Manage Board Members
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onReorderLists}>
                  Reorder Board Lists
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
