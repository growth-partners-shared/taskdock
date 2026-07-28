import { useEffect, useState } from "react";

// API
import { authApi } from "@/api/auth.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Eye, EyeOff, KanbanSquare, Loader2, Lock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TYPES
import { ApiError } from "@/types";

interface ResetPasswordState {
  email: string;
  resetToken: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const state = location.state as ResetPasswordState | null;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state?.email || !state?.resetToken) {
      navigate("/forgot-password", { replace: true });
    }
  }, [state, navigate]);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,20}$/;

    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      toast({
        title: "Invalid Password",
        description:
          "Password must be 8-20 characters with uppercase, lowercase, number and special character.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please enter the same password in both fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        email: state!.email,
        resetToken: state!.resetToken,
        newPassword,
      });

      toast({
        title: "Password Reset Successful",
        description: "You can now login using your new password.",
      });

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      const apiError = error as ApiError;

      toast({
        title: "Reset Failed",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 mb-4">
            <KanbanSquare className="h-7 w-7 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold">Reset Password</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">
              New Password <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pl-10 pr-10 h-11"
                value={newPassword}
                disabled={isLoading}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pl-10 pr-10 h-11"
                value={confirmPassword}
                disabled={isLoading}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={
              isLoading || !newPassword.trim() || !confirmPassword.trim()
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
