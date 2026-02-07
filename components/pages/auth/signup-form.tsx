"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppButton from "@/components/AppButton";
import { toast } from "sonner";
import { signUp, signIn } from "@/lib/auth-client";
import Link from "next/link";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signupSchema, type SignupFormData } from "@/schemas/auth.schema";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/onboarding",
      });

      if (result.error) {
        if (result.error.message?.includes("already exists")) {
          toast.error("An account with this email already exists");
        } else {
          toast.error(result.error.message || "Failed to create account");
        }
        setIsLoading(false);
      } else {
        setShowVerificationMessage(true);
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setIsGithubLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/onboarding",
      });
    } catch (_error) {
      toast.error("Failed to sign up with GitHub");
      setIsGithubLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to your email address. Please
            verify your email to continue.
          </p>
        </div>
        <AppButton
          type="outline"
          onClick={() => router.push("/verify-email")}
          className="w-full"
        >
          Go to Verification Page
        </AppButton>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id="name"
                    placeholder="John Doe"
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
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
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
          icon={isLoading ? <Loader2 className="animate-spin" /> : undefined}
        >
          Create Account
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
        onClick={handleGithubSignUp}
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
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
