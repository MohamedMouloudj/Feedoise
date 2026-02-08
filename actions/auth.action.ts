"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/types/api-responses";

export async function resendVerificationEmail(
  email: string,
): Promise<ApiResponse<void>> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.emailVerified) {
      return { success: false, error: "Email already verified" };
    }

    const { status } = await auth.api.sendVerificationEmail({
      headers: await headers(),
      body: {
        email: user.email,
        callbackURL: "/login",
      },
    });

    return { success: status };
  } catch (error) {
    console.error("Resend verification error:", error);
    return { success: false, error: "Failed to resend verification email" };
  }
}

export async function updateUserLanguage(
  language: string,
): Promise<ApiResponse<void>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { preferredLanguage: language },
    });

    return { success: true };
  } catch (error) {
    console.error("Update language error:", error);
    return { success: false, error: "Failed to update language" };
  }
}

export async function signOutUser(): Promise<ApiResponse<void>> {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

export async function requestResetPassword(
  email: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
      },
    });
    return { success: true, data: { message: "Password reset email sent" } };
  } catch (error) {
    console.error("Request reset password error:", error);
    return { success: false, error: "Failed to request password reset" };
  }
}

export async function resetPassword(newPassword: string, token: string) {
  try {
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });
    return { success: true, data: { message: "Password reset successful" } };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Failed to reset password" };
  }
}

export async function checkOnboardingStatus(): Promise<
  ApiResponse<{
    hasOrganization: boolean;
    hasPreferredLanguage: boolean;
    needsOnboarding: boolean;
  }>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organizationMembers: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const hasOrganization = user.organizationMembers.length > 0;
    const hasPreferredLanguage = !!user.preferredLanguage;
    const needsOnboarding = !hasPreferredLanguage;

    return {
      success: true,
      data: {
        hasOrganization,
        hasPreferredLanguage,
        needsOnboarding,
      },
    };
  } catch (error) {
    console.error("Check onboarding status error:", error);
    return { success: false, error: "Failed to check onboarding status" };
  }
}
