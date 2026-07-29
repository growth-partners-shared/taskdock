// THIRD PARTY
import { Plus } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
  owner: boolean;
}

export function AddListButton({ onClick, owner }: Props) {
  return (
    <div className="w-80 shrink-0">
      {owner && (
        <Button
          variant="outline"
          className="h-12 w-full border-dashed"
          onClick={onClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add another list
        </Button>
      )}
    </div>
  );
}
