import type { ApiError } from "@/types";
import { useCallback, useState } from "react";

interface ErrorState {
  error: string | null;
  isError: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const setError = useCallback((error: string | Error | ApiError) => {
    const errorMessage =
      typeof error === "string" ? error : error instanceof Error ? error.message : error.message;

    setErrorState({
      error: errorMessage,
      isError: true,
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  const handleError = useCallback(
    (error: unknown, fallbackMessage = "An error occurred") => {
      if (error instanceof Error) {
        setError(error);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError(fallbackMessage);
      }
    },
    [setError]
  );

  return {
    ...errorState,
    setError,
    clearError,
    handleError,
  };
}
