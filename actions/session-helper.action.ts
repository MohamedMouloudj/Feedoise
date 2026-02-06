"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Helper function to get the current user's session in server actions.
 * @returns betterAuth user `session` or `null` if not authenticated.
 */
export async function getUserSession() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
  } catch (error) {
    console.error("Failed to get user session:", error);
    return null;
  }
}
