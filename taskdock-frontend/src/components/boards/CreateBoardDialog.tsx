import { useEffect, useState } from "react";

// API
import { boardApi } from "@/api/board.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

// TYPES
import { BoardColor } from "@/types";

interface Props {
  open: boolean;
  starred?: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBoardDialog({
  open,
  starred = false,
  onOpenChange,
  onSuccess,
}: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [colors, setColors] = useState<
    {
      name: BoardColor;
      hexCode: string;
    }[]
  >([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<BoardColor>("BLUE");

  useEffect(() => {
    if (!open) return;

    boardApi
      .getBoardColors()
      .then(setColors)
      .catch(() => {});
  }, [open]);

  const handleCreate = async () => {
    if (name.trim().length < 2) {
      toast({
        title: "Validation Failed",
        description: "Board name must be between 2 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await boardApi.createBoard({
        name: name.trim(),
        description: description.trim(),
        color,
      });

      toast({
        title: "Board created",
        description: "Your board is ready.",
      });

      setName("");
      setDescription("");
      setColor("BLUE");

      onOpenChange(false);
      onSuccess();
    } catch (e) {
      toast({
        title: "Failed",
        description: e instanceof Error ? e.message : "Unable to create board.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setName("");
          setDescription("");
          setColor("BLUE");
        }

        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>

          <DialogDescription>
            Create a new board to organize tasks and collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="board-name">
              Board Name <span className="text-red-500">*</span>
            </Label>

            <Input
              id="board-name"
              required
              maxLength={100}
              placeholder="Sprint Planning"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <p className="text-xs text-muted-foreground">2 - 100 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>

              <span className="text-xs text-muted-foreground">
                {description.length}/500
              </span>
            </div>

            <Textarea
              id="description"
              rows={4}
              maxLength={500}
              placeholder="Describe your board..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>
              Board Color <span className="text-red-500">*</span>
            </Label>

            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`h-10 w-10 rounded-full border-2 transition-all duration-200 ${
                    color === c.name
                      ? "scale-110 border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c.hexCode,
                  }}
                />
              ))}
            </div>
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

          <Button
            onClick={handleCreate}
            disabled={loading || name.trim().length < 2}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
