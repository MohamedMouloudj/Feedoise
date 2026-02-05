import { prisma } from "@/lib/db";
import { OrganizationRole } from "@/lib/generated/prisma/enums";

/**
 * Service class for organization-related operations.
 */
export class OrganizationsService {
  /**
   * Get a user's role in a specific organization.'
   * @param userId - The ID of the user.
   * @param organizationId - The ID of the organization.
   * @returns The user's `role in the organization` ("owner", "member") or `null` if not a member.
   */
  static async getUserRoleInOrganization(
    userId: string,
    organizationId: string,
  ): Promise<OrganizationRole | null> {
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
      },
      select: {
        role: true,
      },
    });
    return membership ? membership.role : null;
  }
}
