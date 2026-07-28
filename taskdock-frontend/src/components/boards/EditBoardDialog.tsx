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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// TYPES
import { BoardColor, BoardResponse } from "@/types";

interface Props {
  board: BoardResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
export function EditBoardDialog({
  board,
  open,
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
    if (!board) return;

    setName(board.name);
    setDescription(board.description ?? "");
    setColor(board.color);
  }, [board]);

  useEffect(() => {
    if (!open) return;

    boardApi
      .getBoardColors()
      .then(setColors)
      .catch(() => {});
  }, [open]);

  if (!board) return null;

  const handleUpdate = async () => {
    setLoading(true);

    try {
      await boardApi.updateBoard(board.id, {
        name,
        description,
        color,
      });

      toast({
        title: "Board updated",
      });

      onSuccess();
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "Failed",
        description: e instanceof Error ? e.message : "Unable to update board.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label>Name</Label>

            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>

            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`w-9 h-9 rounded-full border-2 transition ${
                    color === c.name
                      ? "border-primary scale-110"
                      : "border-transparent"
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleUpdate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
