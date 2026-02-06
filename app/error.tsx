"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import AppButton from "@/components/AppButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="mb-2 text-4xl font-bold">Something Went Wrong</h1>
        <p className="mb-8 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className="mb-6 overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
            {error.message}
          </pre>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <AppButton onClick={reset} size="lg">
            Try Again
          </AppButton>{" "}
          <AppButton type="secondary" size="lg" href="/">
            Go Home
          </AppButton>
        </div>
      </div>
    </div>
  );
}
