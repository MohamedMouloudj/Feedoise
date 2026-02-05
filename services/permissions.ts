import { prisma } from "@/lib/db";
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
}
