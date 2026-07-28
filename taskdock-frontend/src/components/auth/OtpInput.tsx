import { ClipboardEvent, KeyboardEvent, useEffect, useRef } from "react";

// THIRD PARTY COMPONENTS
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  value: string;
  length?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const values = Array.from({ length }, (_, index) => value[index] ?? "");

  const updateValue = (index: number, digit: string) => {
    const next = [...values];
    next[index] = digit;
    onChange(next.join(""));
  };

  const handleChange = (index: number, input: string) => {
    const digit = input.replace(/\D/g, "").slice(-1);

    updateValue(index, digit);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      if (values[index]) {
        updateValue(index, "");
        return;
      }

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(pasted);

    const focusIndex = Math.min(pasted.length, length - 1);

    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {values.map((digit, index) => (
        <Input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="h-14 w-14 text-center text-xl font-semibold"
        />
      ))}
    </div>
  );
}
