import { prisma } from "@/lib/db";
import {
  Invitation,
  Organization,
  Prisma,
} from "@/lib/generated/prisma/client";
import { OrganizationRole } from "@/lib/generated/prisma/enums";

type OwnedOrgMembership = Prisma.OrganizationMemberGetPayload<{
  include: {
    organization: true;
  };
}>;

/**
 * Service class for organization-related operations.
 */
export class OrganizationsService {
  /**
   * Get a user's role in a specific organization membership.
   * @param userId - The ID of the user.
   * @param organizationId - The ID of the organization.
   * @returns The user's `role in the organization membership` ("owner", "admin", "member") or `null` if not a member.
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

  /**
   * Get all organizations a user belongs to, along with their role in each organization.
   * @param userId - The ID of the user.
   * @returns An array of organizations with membership details.
   */
  static async getUserOrganizations(userId: string) {
    try {
      const organizations = await prisma.organizationMember.findMany({
        where: { userId },
        include: {
          organization: true,
        },
      });
      return organizations;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Foreign key constraint failed (invalid projectId or userId)
        if (error.code === "P2003") {
          throw new Error("Invalid organization or user ID");
        }
        if (error.code === "P2025") {
          throw new Error("User not found");
        }
      }

      throw new Error("Failed to retrieve user organizations");
    }
  }

  /**
   * Get the organization membership owned by a user.
   * @param userId - The ID of the user.
   * @returns The owned organization with membership details or null.
   */
  static async getOwnedOrganization(
    userId: string,
  ): Promise<OwnedOrgMembership | null> {
    try {
      const ownedOrg = await prisma.organizationMember.findFirst({
        where: {
          userId,
          role: OrganizationRole.owner,
        },
        include: {
          organization: true,
        },
      });
      return ownedOrg;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new Error("Invalid user ID");
        }
      }
      console.error("Error fetching owned organization:", error);
      throw new Error("Failed to retrieve owned organization");
    }
  }

  /**
   * Get organizations where user is admin or member (not owner).
   * @param userId - The ID of the user.
   * @returns An array of organizations with membership details.
   */
  static async getMemberOrganizations(userId: string) {
    try {
      const memberOrgs = await prisma.organizationMember.findMany({
        where: {
          userId,
          role: {
            in: [OrganizationRole.admin, OrganizationRole.member],
          },
        },
        include: {
          organization: true,
        },
        orderBy: {
          role: "asc", // admin first, then member
        },
      });
      return memberOrgs;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new Error("Invalid user ID");
        }
      }
      console.error("Error fetching member organizations:", error);
      throw new Error("Failed to retrieve member organizations");
    }
  }

  /**
   * Find all public organizations with pagination and search.
   * @param skip - Number of items to skip
   * @param take - Number of items to take
   * @param searchQuery - Optional search query for organization name
   * @returns Object with items and hasMore flag
   */
  static async findAllPublic({
    skip = 0,
    take = 12,
    searchQuery,
  }: {
    skip?: number;
    take?: number;
    searchQuery?: string;
  } = {}): Promise<{
    items: Array<
      Organization & {
        _count: {
          members: number;
          projects: number;
        };
      }
    >;
    hasMore: boolean;
  }> {
    try {
      const where: Prisma.OrganizationWhereInput = searchQuery
        ? {
            name: { contains: searchQuery, mode: "insensitive" },
          }
        : {};

      const organizations = await prisma.organization.findMany({
        where,
        skip,
        take: take + 1, // Fetch one extra to check hasMore
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      });

      const hasMore = organizations.length > take;
      return {
        items: organizations.slice(0, take),
        hasMore,
      };
    } catch (error) {
      console.error("Error finding public organizations:", error);
      throw new Error("Failed to retrieve public organizations");
    }
  }

  /**
   * Find organization by slug with member count and project count.
   * @param slug - Organization slug
   * @returns Organization with counts or null
   */
  static async findBySlug(slug: string): Promise<
    | (Organization & {
        _count: {
          members: number;
          projects: number;
        };
      })
    | null
  > {
    try {
      const organization = await prisma.organization.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      });

      return organization;
    } catch (error) {
      console.error("Error finding organization by slug:", error);
      throw new Error("Failed to find organization");
    }
  }

  /**
   * Get public projects for an organization.
   * @param organizationId - Organization ID
   * @returns Array of public projects
   */
  static async getPublicProjects(organizationId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          organizationId,
          isPublic: true,
        },
        orderBy: { createdAt: "desc" },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              members: true,
              followers: true,
              threads: true,
            },
          },
        },
      });

      return projects;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new Error("Invalid organization ID");
        }
      }
      console.error("Error fetching public projects:", error);
      throw new Error("Failed to retrieve public projects");
    }
  }
}
