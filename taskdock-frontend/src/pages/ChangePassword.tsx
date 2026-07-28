import { useState } from "react";

// API
import { userApi } from "@/api/user.api";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  toggleVisible: () => void;
  autoComplete: string;
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  toggleVisible,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} <span className="text-red-500">*</span>
      </Label>

      <div className="relative">
        <Input
          required
          autoComplete={autoComplete}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={toggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function ChangePassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Validation Failed",
        description: "Password must contain at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await userApi.changePassword({
        oldPassword,
        newPassword,
      });

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });

      navigate("/boards");
    } catch (error) {
      toast({
        title: "Failed",
        description:
          error instanceof Error ? error.message : "Unable to change password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-lg">
      <form onSubmit={handleSubmit} autoComplete="off">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>

            <div>
              <p className="mt-2 text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <PasswordField
              label="Old Password"
              value={oldPassword}
              onChange={setOldPassword}
              visible={showOld}
              toggleVisible={() => setShowOld((v) => !v)}
              autoComplete="current-password"
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNew}
              toggleVisible={() => setShowNew((v) => !v)}
              autoComplete="new-password"
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirm}
              toggleVisible={() => setShowConfirm((v) => !v)}
              autoComplete="off"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                !oldPassword.trim() ||
                !newPassword.trim() ||
                !confirmPassword.trim()
              }
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
