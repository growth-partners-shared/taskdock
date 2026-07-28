interface CountdownProps {
  seconds: number;
}

export function Countdown({ seconds }: CountdownProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatted = `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <span className="text-sm text-muted-foreground">
      Resend available in {formatted}
    </span>
  );
}
