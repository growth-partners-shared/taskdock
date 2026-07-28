import { useState } from "react";

// API
import { authApi } from "@/api/auth.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Loader2, Mail, KanbanSquare } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TYPES
import { ApiError } from "@/types";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword({
        email,
      });

      toast({
        title: "Verification code sent",
        description: "Please check your email.",
      });

      navigate("/verify-email", {
        replace: true,
        state: {
          email,
          mode: "reset-password",
        },
      });
    } catch (error) {
      const apiError = error as ApiError;

      toast({
        title: "Request failed",
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

          <h1 className="text-2xl font-semibold">Forgot Password</h1>

          <p className="text-sm text-muted-foreground mt-2">
            Enter your registered email and we'll send a verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="pl-10 h-11"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full h-11" disabled={isLoading || !email.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Verification Code"
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
