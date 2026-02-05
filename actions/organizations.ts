"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { getUserSession } from "./user-session-helper";

export async function createOrganization(data: { name: string; slug: string }) {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const existing = await prisma.organization.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, error: "This URL is already taken" };
    }

    // Create organization + add user as owner in a transaction
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        members: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
    });

    return { success: true, organization };
  } catch (error) {
    console.error("Failed to create organization:", error);
    return { success: false, error: "Failed to create organization" };
  }
}

export async function joinOrganization(inviteCode: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const org = await prisma.organization.findUnique({
    where: { inviteCode },
  });

  if (!org) {
    return { success: false, error: "Invalid invite code" };
  }

  // Add user as member
  await prisma.organizationMember.create({
    data: {
      organizationId: org.id,
      userId: session.user.id,
      role: "member",
    },
  });

  return { success: true, organization: org };
}
