import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownReturn {
  seconds: number;
  isRunning: boolean;
  start: (duration?: number) => void;
  stop: () => void;
  reset: (duration?: number) => void;
}

export function useCountdown(initialDuration: number): UseCountdownReturn {
  const [seconds, setSeconds] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const clear = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (duration = initialDuration) => {
      stop();
      setSeconds(duration);
    },
    [initialDuration, stop],
  );

  const start = useCallback(
    (duration = initialDuration) => {
      clear();

      setSeconds(duration);
      setIsRunning(true);

      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clear();
            setIsRunning(false);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    },
    [initialDuration],
  );

  useEffect(() => {
    return () => clear();
  }, []);

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset,
  };
}
