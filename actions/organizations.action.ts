"use server";

import { prisma } from "@/lib/db";
import { getUserSession } from "./session-helper.action";
import { OrganizationsService } from "@/services/Organizations";
import { ApiResponse } from "@/types/api-responses";
import { Organization } from "@/lib/generated/prisma/client";

export async function createOrganization(data: {
  name: string;
  slug: string;
}): Promise<ApiResponse<{ organization: Organization }>> {
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

    const organization = await OrganizationsService.create(
      data.name,
      data.slug,
      session.user.id,
    );

    return { success: true, data: { organization } };
  } catch (error) {
    console.error("Failed to create organization:", error);
    return {
      success: false,
      error:
        "Failed to create organization: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}

export async function joinOrganization(
  token: string,
): Promise<ApiResponse<{ organization: Organization }>> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const invitation = await OrganizationsService.getInvitation(token);
    if (!invitation) {
      return { success: false, error: "Invalid invitation token" };
    }

    if (invitation.usedAt) {
      return { success: false, error: "This invitation has already been used" };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, error: "This invitation has expired" };
    }

    if (invitation.email !== session.user.email) {
      return {
        success: false,
        error: "This invitation was sent to a different email address",
      };
    }

    const existingMember = await OrganizationsService.getUserRoleInOrganization(
      session.user.id,
      invitation.organizationId,
    );

    if (existingMember) {
      return {
        success: false,
        error: "You are already a member of this organization",
      };
    }

    if (
      !(await OrganizationsService.updateInvitationAsUsed(
        invitation,
        session.user.id,
      ))
    ) {
      return { success: false, error: "Failed to join organization" };
    }

    return { success: true, data: { organization: invitation.organization } };
  } catch (error) {
    console.error("Failed to join organization:", error);
    return {
      success: false,
      error:
        "Failed to join organization: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}
