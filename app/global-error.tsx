"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import AppButton from "@/components/AppButton";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-foreground">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>

            <h1 className="mb-2 text-4xl font-bold">Critical Error</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              A critical error occurred. The application needs to reload.
            </p>

            {process.env.NODE_ENV === "development" && (
              <pre className="mb-6 overflow-auto rounded-lg bg-gray-100 p-4 text-left text-xs dark:bg-gray-800">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <AppButton onClick={reset} size="lg">
                Reload Application
              </AppButton>
              <AppButton
                onClick={() => (window.location.href = "/")}
                type="secondary"
                size="lg"
              >
                Go Home
              </AppButton>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
