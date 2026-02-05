import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  getOrgPermissions,
  getProjectPermissions,
  Permission,
} from "@/lib/permissions";

/**
 * Helper service function to get all permissions for a user based on their `organization` and `project` roles.
 * @param userId User ID
 * @param organizationId Organization ID
 * @param projectId (optional) Project ID - if provided, will include project-level permissions in the result
 * @returns Array of permissions associated with the user
 */
export async function getUserPermissions(
  userId: string,
  organizationId: string,
  projectId?: string,
): Promise<Permission[]> {
  try {
    const permissions: Permission[] = [];

    const orgMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });

    if (orgMember) {
      permissions.push(...getOrgPermissions(orgMember.role));
    }

    if (projectId) {
      const projectMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

      if (projectMember) {
        permissions.push(...getProjectPermissions(projectMember.role));
      }
    }

    // remove duplicates
    return [...new Set(permissions)];
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new Error("Invalid organization or project ID");
      }
      if (error.code === "P2025") {
        throw new Error("User is not a member of this organization or project");
      }
    }
    throw new Error("Failed to retrieve user permissions");
  }
}
