import { useState } from "react";

// API
import { getCurrentUser, logout } from "@/api/common.api";
import { userApi } from "@/api/user.api";

// COMPONENTS
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";

// THIRD PARTY
import { LogOut, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// UI
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
  async function handleDeleteAccount() {
    try {
      setDeleting(true);

      await userApi.deleteAccount();

      logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.profileImageUrl} />

            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <div className="px-3 py-2">
            <p className="font-medium">{user.fullName}</p>

            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        loading={deleting}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteAccount}
      />
    </>
  );
}
