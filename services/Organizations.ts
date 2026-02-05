import { prisma } from "@/lib/db";
import {
  Invitation,
  Organization,
  Prisma,
} from "@/lib/generated/prisma/client";
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
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("Organization not found");
        }
      }
      console.error("Error fetching user role in organization:", error);
      throw new Error("Failed to retrieve user role in organization");
    }
  }

  /**
   * Create a new organization with the specified name and slug, and add the user as an owner.
   * @param name - Organization name
   * @param slug - Unique slug for the organization
   * @param ownerId - User ID of the organization owner
   * @returns The created organization object
   * @throws Error if organization creation fails (e.g., slug already exists, invalid owner ID)
   */
  static async create(
    name: string,
    slug: string,
    ownerId: string,
  ): Promise<Organization> {
    try {
      const organization = await prisma.organization.create({
        data: {
          name,
          slug,
          members: {
            create: {
              userId: ownerId,
              role: OrganizationRole.owner,
            },
          },
        },
      });
      return organization;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("An organization with this slug already exists");
        }
        if (error.code === "P2003") {
          throw new Error("Invalid owner ID");
        }
      }
      console.error("Error creating organization:", error);
      throw new Error("Failed to create organization");
    }
  }

  /**
   * Get an invitation by token with organization details.
   * @param token - The invitation token.
   * @returns The invitation with organization details.
   * @throws Error if invitation not found or database error occurs.
   */
  static async getInvitation(
    token: string,
  ): Promise<(Invitation & { organization: Organization }) | null> {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: {
          organization: true,
        },
      });

      return invitation;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025 won't happen with findUnique (it returns null), but keeping for safety
        if (error.code === "P2025") {
          throw new Error("Invitation not found");
        }
      }

      console.error("Error fetching invitation:", error);
      throw new Error("Failed to retrieve invitation");
    }
  }

  /**
   * Create organization member with role from invitation and mark invitation as used
   * @param invitation - The invitation object
   * @param userId - The ID of the user joining the organization
   * @returns - True if successful
   * @throws Error if operation fails
   */
  static async updateInvitationAsUsed(
    invitation: Invitation,
    userId: string,
  ): Promise<boolean> {
    try {
      await prisma.$transaction([
        prisma.organizationMember.create({
          data: {
            organizationId: invitation.organizationId,
            userId: userId,
            role: invitation.role,
          },
        }),
        prisma.invitation.update({
          where: { id: invitation.id },
          data: { usedAt: new Date() },
        }),
      ]);
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new Error("Invalid organization ID or user ID");
        }
      }
      console.error("Error updating invitation as used:", error);
      throw new Error("Failed to update invitation");
    }
  }
}
