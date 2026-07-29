// THIRD PARTY COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TYPES
import { MemberResponse } from "@/types";

interface Props {
  members: MemberResponse[];
  maxVisible?: number;
}

export function MembersAvatarGroup({ members, maxVisible = 5 }: Props) {
  const visibleMembers = members.slice(0, maxVisible);
  const remaining = Math.max(0, members.length - visibleMembers.length);

  return (
    <div className="flex -space-x-3">
      {visibleMembers.map((member) => (
        <Avatar
          key={member.memberId}
          className="h-9 w-9 border-2 border-background"
        >
          <AvatarImage src={member.profileImageUrl} alt={member.fullName} />

          <AvatarFallback>
            {member.fullName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}

      {remaining > 0 && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold">
          +{remaining}
        </div>
      )}
    </div>
  );
}
