"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppButton from "@/components/AppButton";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/auth.schema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error("Invalid or missing reset token");
    }
  }, [token]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset successful!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const error = await response.json();
        if (
          error.message?.includes("expired") ||
          error.message?.includes("invalid")
        ) {
          setTokenValid(false);
          toast.error("Reset link has expired or is invalid");
        } else {
          toast.error(error.message || "Failed to reset password");
        }
      }
    } catch (_error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <Logo className="mx-auto mb-6" size="lg" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>

          <AppButton
            type="primary"
            onClick={() => router.push("/forgot-password")}
            className="w-full"
          >
            Request New Reset Link
          </AppButton>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <Logo className="mx-auto mb-6" size="lg" />

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Password reset!</h1>
            <p className="text-muted-foreground">
              Your password has been successfully reset. Redirecting to sign
              in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto mb-6" size="lg" />
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <AppButton
            type="primary-submit"
            disabled={isLoading || isSubmitting}
            className="w-full"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </AppButton>
        </form>
      </div>
    </div>
  );
}
