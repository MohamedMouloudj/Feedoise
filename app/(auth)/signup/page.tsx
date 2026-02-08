'use i18n'

import { SignupForm } from "@/components/pages/auth/signup-form";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Feedoise",
  description: "Create your Feedoise account",
};

export default function SignupPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo responsive size="lg" className="justify-center" />
          <h1 className="text-3xl font-bold">Get started</h1>
          <p className="mt-2 text-muted-foreground">
            Create your account to start managing feedback
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
