import { useState } from "react";

// API
import { authApi } from "@/api/auth.api";
import { setAuthToken, setCurrentUser } from "@/api/common.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Eye, EyeOff, KanbanSquare, Loader2, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TYPES
import { ApiError } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
      });

      setAuthToken(response.accessToken, response.expiresAt);
      setCurrentUser(response.user);

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

      navigate("/boards", { replace: true });
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.message === "Please verify your email before logging in.") {
        toast({
          title: "Email verification required",
          description: "We've redirected you to verify your email.",
        });

        navigate("/verify", {
          replace: true,
          state: {
            email,
            type: "email-verification",
          },
        });

        return;
      }

      toast({
        title: "Login failed",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
            <KanbanSquare className="h-7 w-7 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold">Welcome to TaskDock</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Collaborate to improve your workflows.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-10 pr-10"
              />

              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full"
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
