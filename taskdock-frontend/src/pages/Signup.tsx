import { useState } from "react";

// API
import { authApi } from "@/api/auth.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  KanbanSquare,
} from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TYPES
import { ApiError } from "@/types";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,16}$/;

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      toast({
        title: "Missing details",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      toast({
        title: "Invalid Password",
        description:
          "Password must be 8-16 characters long and contain uppercase, lowercase, number and special character.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        fullName: name.trim(),
        email: email.trim(),
        phoneNumber,
        password,
      });

      toast({
        title: "Verification email sent",
        description: "Please enter the 6-digit code sent to your email.",
      });

      navigate("/verify-email", {
        replace: true,
        state: {
          email: response.email,
          mode: "email",
        },
      });
    } catch (error) {
      const apiError = error as ApiError;

      toast({
        title: "Registration Failed",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/40 px-4">
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
              <KanbanSquare className="h-7 w-7 text-primary" />
            </div>

            <h1 className="mb-2 text-2xl font-semibold">
              Create your TaskDock Account
            </h1>

            <p className="text-sm text-muted-foreground">
              Collaborate to Improve your Workflows.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  required
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-muted/50 pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  required
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-muted/50 pl-10"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  required
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-muted/50 pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-muted/50 pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                Password must contain:
                <br />• 8-16 characters
                <br />• At least one uppercase letter
                <br />• At least one lowercase letter
                <br />• At least one number
                <br />• At least one special character (@#$%^&+=!)
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  required
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-muted/50 pl-10 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p
                  className={`text-xs ${
                    password === confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {password === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl"
              disabled={
                isLoading ||
                !name.trim() ||
                !email.trim() ||
                phoneNumber.length !== 10 ||
                !password.trim() ||
                !confirmPassword.trim() ||
                password !== confirmPassword
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
