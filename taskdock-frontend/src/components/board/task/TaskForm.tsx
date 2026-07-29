import { useEffect, useState } from "react";

// THIRD PARTY
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// TYPES
import {
  CreateBoardTaskRequest,
  UpdateBoardTaskRequest,
  MemberResponse,
} from "@/types";

// UTILS
import { cn } from "@/lib/utils";

export interface TaskFormProps {
  mode: "CREATE" | "EDIT";

  boardListId?: number;

  initialValues?: Partial<UpdateBoardTaskRequest>;

  members: MemberResponse[];

  loading: boolean;

  submitLabel: string;

  onSubmit: (request: CreateBoardTaskRequest | UpdateBoardTaskRequest) => void;

  onCancel: () => void;
}

export function TaskForm({
  mode,
  boardListId,
  initialValues,
  members,
  loading,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const isCreate = mode === "CREATE";

  const [title, setTitle] = useState(initialValues?.title ?? "");

  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "HIGHEST"
  >(initialValues?.priority ?? "MEDIUM");

  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialValues?.dueDate ? new Date(initialValues.dueDate) : undefined,
  );

  const [dueTime, setDueTime] = useState(
    initialValues?.dueDate
      ? format(new Date(initialValues.dueDate), "HH:mm")
      : "09:00",
  );

  const [assigneeId, setAssigneeId] = useState<number | undefined>(
    initialValues?.assigneeUserId,
  );

  useEffect(() => {
    setTitle(initialValues?.title ?? "");

    setDescription(initialValues?.description ?? "");

    setPriority(initialValues?.priority ?? "MEDIUM");

    if (initialValues?.dueDate) {
      const date = new Date(initialValues.dueDate);
      setDueDate(date);
      setDueTime(format(date, "HH:mm"));
    } else {
      setDueDate(undefined);
      setDueTime("09:00");
    }

    setAssigneeId(initialValues?.assigneeUserId);
  }, [initialValues]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      isCreate &&
      (!title.trim() || title.trim().length < 2 || !dueDate || !assigneeId)
    ) {
      return;
    }

    const request: CreateBoardTaskRequest | UpdateBoardTaskRequest = {};

    if (title.trim()) request.title = title.trim();

    if (description.trim()) request.description = description.trim();

    if (priority) request.priority = priority;

    if (dueDate) {
      request.dueDate = `${format(dueDate, "yyyy-MM-dd")}T${dueTime}:00`;
    }

    if (assigneeId) {
      request.assigneeUserId = assigneeId;
    }

    if (isCreate) {
      onSubmit({
        boardListId: boardListId!,
        ...request,
      });
    } else {
      onSubmit(request);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}

      <div className="space-y-2">
        <Label>
          Title {isCreate && <span className="text-red-500">*</span>}
        </Label>

        <Input
          required={isCreate}
          minLength={2}
          maxLength={200}
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="text-xs text-muted-foreground">2 - 200 characters</p>
      </div>

      {/* Description */}

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Description</Label>

          <span className="text-xs text-muted-foreground">
            {description.length}/5000
          </span>
        </div>

        <Textarea
          rows={5}
          maxLength={5000}
          placeholder="Describe this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Priority */}

      <div className="space-y-2">
        <Label>
          Priority {isCreate && <span className="text-red-500">*</span>}
        </Label>

        <Select
          value={priority}
          onValueChange={(value) =>
            setPriority(value as "LOW" | "MEDIUM" | "HIGH" | "HIGHEST")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="LOW">🟢 Low</SelectItem>
            <SelectItem value="MEDIUM">🔵 Medium</SelectItem>
            <SelectItem value="HIGH">🟠 High</SelectItem>
            <SelectItem value="HIGHEST">🔴 Highest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}

      <div className="space-y-2">
        <Label>
          Due Date {isCreate && <span className="text-red-500">*</span>}
        </Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />

              {dueDate ? format(dueDate, "PPP") : "Select due date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* Due Time */}

      <div className="space-y-2">
        <Label>
          Due Time {isCreate && <span className="text-red-500">*</span>}
        </Label>

        <Input
          required={isCreate}
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>

      {/* Assignee */}

      <div className="space-y-2">
        <Label>
          Assignee {isCreate && <span className="text-red-500">*</span>}
        </Label>

        <Select
          value={assigneeId ? String(assigneeId) : ""}
          onValueChange={(value) => setAssigneeId(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a team member" />
          </SelectTrigger>

          <SelectContent>
            {members
              .filter(
                (member) => member.role === "OWNER" || member.role === "EDITOR",
              )
              .map((member) => (
                <SelectItem key={member.userId} value={String(member.userId)}>
                  {member.fullName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {members.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No assignable members available.
          </p>
        )}
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            loading ||
            (isCreate && (title.trim().length < 2 || !dueDate || !assigneeId))
          }
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
