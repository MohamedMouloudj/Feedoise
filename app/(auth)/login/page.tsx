"use i18n";

import { LoginForm } from "@/components/pages/auth/login-form";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Feedoise",
  description: "Sign in to your Feedoise account",
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="justify-center" size="lg" />
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
