// API
import { logout } from "@/api/common.api";

// THIRD PARTY
import { Link } from "react-router-dom";
import { ShieldX, LogOut } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Your account is currently inactive or you don't have permission to
          access this page.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button asChild>
            <Link to="/" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Login Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
