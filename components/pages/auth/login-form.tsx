"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppButton from "@/components/AppButton";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/space",
      });

      if (result.error) {
        if (result.error.message?.includes("not verified")) {
          toast.error("Please verify your email before signing in", {
            action: {
              label: "Resend",
              onClick: () => router.push(`/verify-email?email=${data.email}`),
            },
          });
        } else if (result.error.message?.includes("Invalid")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(result.error.message || "Failed to sign in");
        }
        setIsLoading(false);
      } else {
        toast.success("Welcome back!");
        // Let middleware handle the redirect to avoid timing issues
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/space",
      });
      // Social auth will handle redirect automatically
    } catch (_error) {
      toast.error("Failed to sign in with GitHub");
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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

        <AppButton
          type="primary-submit"
          disabled={isLoading || isSubmitting}
          className="w-full"
          icon={isLoading ? <Loader2 className="animate-spin" /> : undefined}
        >
          Sign In
        </AppButton>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <AppButton
        type="outline"
        onClick={handleGithubSignIn}
        disabled={isGithubLoading || isLoading}
        className="w-full bg-black text-white hover:bg-black/90 hover:text-white transition-colors"
        icon={
          isGithubLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <FontAwesomeIcon
              icon={faGithub}
              width={20}
              height={20}
              className="text-white"
            />
          )
        }
      >
        Continue with GitHub
      </AppButton>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
