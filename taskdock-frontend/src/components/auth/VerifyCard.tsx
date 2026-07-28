// COMPONENTS
import { Countdown } from "./Countdown";
import { OtpInput } from "./OtpInput";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VerifyCardProps {
  title: string;
  description: string;
  email: string;

  otp: string;
  onOtpChange: (value: string) => void;

  loading: boolean;
  resending: boolean;

  canResend: boolean;
  countdown: number;

  showResend?: boolean;

  onVerify: () => void;
  onResend: () => void;
}

export function VerifyCard({
  title,
  description,
  email,
  otp,
  onOtpChange,
  loading,
  resending,
  canResend,
  countdown,
  showResend = true,
  onVerify,
  onResend,
}: VerifyCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>

        <p className="text-sm text-muted-foreground">{description}</p>

        <p className="text-sm font-medium break-all">{email}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <OtpInput value={otp} onChange={onOtpChange} disabled={loading} />

        <Button
          className="w-full"
          onClick={onVerify}
          disabled={loading || otp.length !== 6}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>

        {showResend && (
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the verification code?
            </p>

            {canResend ? (
              <Button
                variant="link"
                className="p-0"
                disabled={resending}
                onClick={onResend}
              >
                {resending ? "Sending..." : "Resend Code"}
              </Button>
            ) : (
              <Countdown seconds={countdown} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
