import { useState } from "react";

// API
import { boardMemberApi } from "@/api/board-member.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TYPES
import { BoardRole } from "@/types";

interface Props {
  boardId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InviteMemberDialog({
  boardId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [role, setRole] = useState<BoardRole>("EDITOR");

  const handleInvite = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);

      await boardMemberApi.inviteMember(boardId, {
        email: email.trim(),
        role,
      });

      toast({
        title: "Member invited",
        description: "Invitation sent successfully.",
      });

      setEmail("");
      setRole("EDITOR");

      onSuccess();
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "Failed",
        description: e instanceof Error ? e.message : "Error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>

          <DialogDescription>
            Invite a member to collaborate on this board.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>

            <Input
              id="email"
              required
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Enter the registered email address of the member.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>

            <Select
              value={role}
              onValueChange={(value) => setRole(value as BoardRole)}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              Editors can create and modify tasks. Viewers have read-only
              access.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={handleInvite} disabled={loading || !email.trim()}>
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
