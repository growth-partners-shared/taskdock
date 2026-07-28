// THIRD PARTY
import { Check } from "lucide-react";

// TYPES
import { BoardColor } from "@/types";

// UTILS
import { cn } from "@/lib/utils";

const COLORS: Record<BoardColor, string> = {
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
  value: BoardColor;
  onChange: (color: BoardColor) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {(Object.keys(COLORS) as BoardColor[]).map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center",
            value === color
              ? "border-primary scale-105"
              : "border-border hover:scale-105",
          )}
          style={{
            backgroundColor: COLORS[color],
          }}
        >
          {value === color && <Check className="h-5 w-5 text-white" />}
        </button>
      ))}
    </div>
  );
}
