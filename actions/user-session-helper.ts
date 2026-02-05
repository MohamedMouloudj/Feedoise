"use server";

import { auth, Session } from "@/lib/auth";
import { headers } from "next/headers";
import { ProjectsService } from "@/services/Projects";
import { OrganizationsService } from "@/services/Organizations";

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

/**
 * Helper function to check permissions before allowing certain actions on a project.
 * @param projectId - The ID of the project to check the user's role in.
 * @param session - Optional betterAuth user `session`. If not provided, it will be fetched.
 * @returns The user's `role in the project` or `null` if not authenticated or not a member of the project.
 */
export async function getProjectMemberRole(
  projectId: string,
  session: Session | null = null,
) {
  try {
    if (!session) {
      session = await getUserSession();
    }
    if (!session) return null;

    const role = await ProjectsService.getUserRoleInProject(
      session.user.id,
      projectId,
    );
    return role || null;
  } catch (error) {
    console.error("Failed to get member role:", error);
    return null;
  }
}

/** Helper function to check permissions before allowing certain actions on an organization.
 * @param organizationId - The ID of the organization to check the user's role in.
 * @param session - Optional betterAuth user `session`. If not provided, it will be fetched.
 * @returns The user's `role in the organization` or `null` if not authenticated or not a member of the organization.
 */
export async function getOrganizationMemberRole(
  organizationId: string,
  session: Session | null = null,
) {
  try {
    if (!session) {
      session = await getUserSession();
    }
    if (!session) return null;
    const role = await OrganizationsService.getUserRoleInOrganization(
      session.user.id,
      organizationId,
    );
    return role || null;
  } catch (error) {
    console.error("Failed to get member role:", error);
    return null;
  }
}
