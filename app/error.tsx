"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      data-testid="error-boundary"
      className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center"
    >
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button
        data-testid="btn-retry"
        onClick={() => reset()}
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}
