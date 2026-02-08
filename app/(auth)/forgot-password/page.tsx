"use client";

import { useState, useTransition } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppButton from "@/components/AppButton";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/auth.schema";
import { requestResetPassword } from "@/actions/auth.action";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const email = useWatch({ control, name: "email" });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      startTransition(async () => {
        const response = await requestResetPassword(data.email);

        if (response.success) {
          setEmailSent(true);
          toast.success("Password reset email sent!");
        } else {
          toast.error(response.error || "Failed to send reset email");
        }
      });
    } catch (_error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (emailSent) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Check your email</h1>
            <p className="text-muted-foreground">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              <p>
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </p>
            </div>

            <AppButton
              type="outline"
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

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="justify-center" size="lg" />
          <h1 className="text-3xl font-bold">Forgot password?</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      disabled={isPending || isSubmitting}
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
            disabled={isPending || isSubmitting}
            className="w-full"
          >
            Send Reset Link
          </AppButton>
        </form>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
