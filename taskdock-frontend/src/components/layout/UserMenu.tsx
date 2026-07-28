// API
import { getCurrentUser, logout } from "@/api/common.api";

// THIRD PARTY
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

// THIRD PARTY COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const navigate = useNavigate();

  const user = getCurrentUser();

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((x) => x[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login", {
      replace: true,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.profileImageUrl} />

          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-3 py-2">
          <p className="font-medium">{user.fullName}</p>

          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
