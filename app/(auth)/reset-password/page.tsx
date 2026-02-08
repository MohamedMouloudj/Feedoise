import AppButton from "@/components/AppButton";
import ResetPasswordForm from "@/components/pages/auth/reset-password-form";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: ResetPasswordPageProps["searchParams"];
}) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>

          <AppButton
            type="primary"
            onClick={() => redirect("/forgot-password")}
            className="w-full"
          >
            Request New Reset Link
          </AppButton>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
