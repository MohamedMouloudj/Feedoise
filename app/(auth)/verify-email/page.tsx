"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, RefreshCw } from "lucide-react";
import AppButton from "@/components/AppButton";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/actions/auth.action";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is required");
      return;
    }

    try {
      startTransition(async () => {
        const result = await resendVerificationEmail(email);
        if (result.success) {
          toast.success("Verification email sent! Please check your inbox.");
          setCountdown(60); // 60 second cooldown
        } else {
          toast.error(result.error || "Failed to resend verification email");
        }
      });
    } catch (_error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
          <Mail className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-foreground">{email}</span>
            ) : (
              <>your email</>
            )}
            . Click the link in the email to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              Didn&apos;t receive the email? Check your spam folder or click the
              button below to resend.
            </p>
          </div>

          <AppButton
            type="outline"
            onClick={handleResend}
            disabled={isResending || countdown > 0}
            className="w-full"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isResending ? "animate-spin" : ""}`}
            />
            {countdown > 0
              ? `Resend in ${countdown}s`
              : isResending
                ? "Sending..."
                : "Resend Verification Email"}
          </AppButton>

          <AppButton
            type="ghost"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Back to Sign In
          </AppButton>
        </div>
      </div>
    </div>
  );
}
