import { useEffect, useState } from "react";

// API
import { boardMemberApi } from "@/api/board-member.api";

//HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Trash2, UserPlus } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// TYPES
import { MemberResponse, BoardRole, MemberListResponse } from "@/types";

interface Props {
  boardId: number;
  owner: boolean;
  members: MemberListResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onInvite: () => void;
}
export function MembersDrawer({
  boardId,
  owner,
  members,
  open,
  onOpenChange,
  onSuccess,
  onInvite,
}: Props) {
  const { toast } = useToast();

  const [localMembers, setLocalMembers] = useState<MemberResponse[]>(
    members.members,
  );

  useEffect(() => {
    setLocalMembers(members.members);
  }, [members]);

  async function updateRole(memberId: number, role: BoardRole) {
    try {
      await boardMemberApi.updateMemberRole(boardId, memberId, { role });

      toast({
        title: "Role updated",
        description: "Member role updated successfully.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update member role.",
        variant: "destructive",
      });
    }
  }

  async function removeMember(memberId: number) {
    try {
      await boardMemberApi.deleteMember(boardId, memberId);

      toast({
        title: "Member removed",
        description: "Member removed from board.",
      });

      onOpenChange(false);

      onSuccess();
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to remove member.",
        variant: "destructive",
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b pb-4">
          <SheetTitle>
            Manage Board Members ({members.totalMembers}/{members.maxMembers})
          </SheetTitle>
        </SheetHeader>

        {owner && members.canInviteMember && (
          <div className="mt-6 mb-5">
            <Button className="w-full" onClick={onInvite}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        )}
        <div className="mt-6 space-y-4">
          {localMembers.map((member) => (
            <div
              key={member.memberId}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={member.profileImageUrl} />
                  <AvatarFallback>
                    {member.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{member.fullName}</p>

                  <p className="truncate text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>

              {member.role === "OWNER" ? (
                <div className="mt-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    OWNER
                  </span>
                </div>
              ) : owner ? (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      updateRole(member.memberId, value as BoardRole)
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMember(member.memberId)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {member.role}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
