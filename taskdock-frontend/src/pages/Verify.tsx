import { useEffect, useState } from "react";

//API
import { authApi } from "@/api/auth.api";

// COMPONENTS
import { VerifyCard } from "@/components/auth/VerifyCard";

//HOOKS
import { useCountdown } from "@/hooks/use-countdown";
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { useLocation, useNavigate } from "react-router-dom";

// TYPES
import { ApiError } from "@/types";

interface VerifyLocationState {
  email: string;
  mode: "email" | "reset-password";
}

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useToast();

  const state = location.state as VerifyLocationState | null;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { seconds, isRunning, start } = useCountdown(60);

  useEffect(() => {
    if (!state?.email || !state?.mode) {
      navigate("/login", { replace: true });
      return;
    }

    start();
  }, [navigate, start, state]);

  if (!state) {
    return null;
  }

  const isEmailVerification = state.mode === "email";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Verification Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });

      return;
    }

    try {
      setLoading(true);

      if (isEmailVerification) {
        await authApi.verifyEmail({
          email: state.email,
          verificationCode: otp,
        });

        toast({
          title: "Email Verified",
          description: "Your account has been verified successfully.",
        });

        navigate("/login", {
          replace: true,
        });
      } else {
        const response = await authApi.verifyResetPassword({
          email: state.email,
          verificationCode: otp,
        });

        navigate("/reset-password", {
          replace: true,
          state: {
            email: state.email,
            resetToken: response.resetToken,
          },
        });
      }
    } catch (error) {
      const apiError = error as ApiError;

      toast({
        title: apiError.status ?? "Verification Failed",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isEmailVerification) {
      return;
    }

    try {
      setResending(true);

      await authApi.resendVerification({
        email: state.email,
      });

      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your email.",
      });

      start();
    } catch (error) {
      const apiError = error as ApiError;

      toast({
        title: apiError.status ?? "Unable to Resend",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center px-4">
      <VerifyCard
        title={
          isEmailVerification ? "Verify Your Email" : "Verify Password Reset"
        }
        description={
          isEmailVerification
            ? "Enter the verification code sent to your email address."
            : "Enter the verification code sent to your email to continue resetting your password."
        }
        email={state.email}
        otp={otp}
        onOtpChange={setOtp}
        loading={loading}
        resending={resending}
        canResend={!isRunning}
        countdown={seconds}
        showResend={isEmailVerification}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </div>
  );
}
