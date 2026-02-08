import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { ProjectRole } from "@/lib/generated/prisma/enums";

export type ProjectWithOrganization = Prisma.ProjectGetPayload<{
  include: {
    organization: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    _count: {
      select: {
        members: true;
        followers: true;
        threads: true;
      };
    };
  };
}>;

export type ProjectWithDetails = Prisma.ProjectGetPayload<{
  include: {
    organization: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    members: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
    };
    _count: {
      select: {
        followers: true;
        threads: true;
        members: true;
      };
    };
  };
}>;

export type CreateProjectData = {
  organizationId: string;
  name: string;
  description?: string;
  slug: string;
  isPublic?: boolean;
};

export type UpdateProjectData = {
  name?: string;
  description?: string;
  slug?: string;
  isPublic?: boolean;
};

/**
 * Service class for project-related operations.
 */
export class ProjectsService {
  /**
   * Get a user's role in a specific project.
   * @param userId - The ID of the user.
   * @param projectId - The ID of the project.
   * @returns The user's role in the project ("maintainer", "contributor") or null if not a member.
   */
  static async getUserRoleInProject(
    userId: string,
    projectId: string,
  ): Promise<ProjectRole | null> {
    try {
      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
        select: {
          role: true,
        },
      });

      return membership?.role ?? null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Foreign key constraint failed (invalid projectId or userId)
        if (error.code === "P2003") {
          throw new Error("Invalid project or user ID");
        }
      }

      console.error("Error fetching user role in project:", error);
      throw new Error("Failed to retrieve user role in project");
    }
  }

  /**
   * Get all projects a user contributes to (as maintainer or contributor),
   * excluding projects from organizations where they have org-level membership.
   * @param userId - The ID of the user.
   * @returns An array of projects with membership and organization details.
   */
  static async getUserContributorProjects(userId: string) {
    try {
      const projectMemberships = await prisma.projectMember.findMany({
        where: { userId },
        include: {
          project: {
            include: {
              organization: true,
            },
          },
        },
      });

      const orgMemberships = await prisma.organizationMember.findMany({
        where: { userId },
        select: { organizationId: true },
      });

      const orgIds = new Set(orgMemberships.map((m) => m.organizationId));

      // Filter out projects from organizations where user has org membership
      const contributorProjects = projectMemberships.filter(
        (pm) => !orgIds.has(pm.project.organizationId),
      );

      return contributorProjects;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Foreign key constraint failed (invalid userId)
        if (error.code === "P2003") {
          throw new Error("Invalid user ID");
        }
      }
      console.error("Error fetching contributor projects:", error);
      throw new Error("Failed to retrieve contributor projects");
    }
  }

  /**
   * Create a new project.
   */
  static async create(
    data: CreateProjectData,
  ): Promise<ProjectWithOrganization> {
    try {
      const project = await prisma.project.create({
        data: {
          organizationId: data.organizationId,
          name: data.name,
          description: data.description,
          slug: data.slug,
          isPublic: data.isPublic ?? true,
        },
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

      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation
        if (error.code === "P2002") {
          throw new Error(
            "Project with this slug already exists in the organization",
          );
        }
        // P2003: Foreign key constraint failed
        if (error.code === "P2003") {
          throw new Error("Invalid organization ID");
        }
      }

      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  }

  /**
   * Find a project by ID.
   */
  static async findById(id: string): Promise<ProjectWithDetails | null> {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              followers: true,
              threads: true,
              members: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      console.error("Error finding project by ID:", error);
      throw new Error("Failed to find project");
    }
  }

  /**
   * Find a project by slug and organization ID.
   */
  static async findBySlug(
    organizationId: string,
    slug: string,
  ): Promise<ProjectWithDetails | null> {
    try {
      const project = await prisma.project.findUnique({
        where: {
          organizationId_slug: {
            organizationId,
            slug,
          },
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              followers: true,
              threads: true,
              members: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      console.error("Error finding project by slug:", error);
      throw new Error("Failed to find project");
    }
  }

  /**
   * Find a project by global slug (searches across all organizations).
   */
  static async findByGlobalSlug(
    slug: string,
  ): Promise<ProjectWithDetails | null> {
    try {
      const project = await prisma.project.findFirst({
        where: { slug },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              followers: true,
              threads: true,
              members: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      console.error("Error finding project by global slug:", error);
      throw new Error("Failed to find project");
    }
  }

  /**
   * Find all public projects (for discovery page) with pagination and search.
   */
  static async findAllPublic({
    skip = 0,
    take = 12,
    searchQuery,
  }: {
    skip?: number;
    take?: number;
    searchQuery?: string;
  } = {}): Promise<{ items: ProjectWithOrganization[]; hasMore: boolean }> {
    try {
      const where: Prisma.ProjectWhereInput = searchQuery
        ? {
            isPublic: true,
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              {
                description: { contains: searchQuery, mode: "insensitive" },
              },
              {
                organization: {
                  name: { contains: searchQuery, mode: "insensitive" },
                },
              },
            ],
          }
        : { isPublic: true };

      const projects = await prisma.project.findMany({
        where,
        skip,
        take: take + 1, // Fetch one extra to check hasMore
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

      const hasMore = projects.length > take;
      return {
        items: projects.slice(0, take),
        hasMore,
      };
    } catch (error) {
      console.error("Error finding public projects:", error);
      throw new Error("Failed to retrieve public projects");
    }
  }

  /**
   * Find all projects in an organization.
   */
  static async findByOrganization(
    organizationId: string,
  ): Promise<ProjectWithOrganization[]> {
    try {
      const projects = await prisma.project.findMany({
        where: { organizationId },
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
      console.error("Error finding projects by organization:", error);
      throw new Error("Failed to retrieve organization projects");
    }
  }

  /**
   * Update a project.
   */
  static async update(
    id: string,
    data: UpdateProjectData,
  ): Promise<ProjectWithOrganization> {
    try {
      const project = await prisma.project.update({
        where: { id },
        data,
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

      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === "P2025") {
          throw new Error("Project not found");
        }
        // P2002: Unique constraint violation
        if (error.code === "P2002") {
          throw new Error(
            "Project with this slug already exists in the organization",
          );
        }
      }

      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  }

  /**
   * Delete a project.
   */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === "P2025") {
          throw new Error("Project not found");
        }
      }

      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }

  /**
   * Check if a user is following a project.
   */
  static async isFollowing(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    try {
      const follower = await prisma.projectFollower.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });

      return !!follower;
    } catch (error) {
      console.error("Error checking project follow status:", error);
      return false;
    }
  }

  /**
   * Follow a project.
   */
  static async follow(userId: string, projectId: string): Promise<void> {
    try {
      await prisma.projectFollower.create({
        data: {
          userId,
          projectId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation (already following)
        if (error.code === "P2002") {
          throw new Error("Already following this project");
        }
        // P2003: Foreign key constraint failed
        if (error.code === "P2003") {
          throw new Error("Invalid project or user ID");
        }
      }

      console.error("Error following project:", error);
      throw new Error("Failed to follow project");
    }
  }

  /**
   * Unfollow a project.
   */
  static async unfollow(userId: string, projectId: string): Promise<void> {
    try {
      await prisma.projectFollower.delete({
        where: {
          projectId_userId: {
            projectId,
            userId,
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found (not following)
        if (error.code === "P2025") {
          throw new Error("Not following this project");
        }
      }

      console.error("Error unfollowing project:", error);
      throw new Error("Failed to unfollow project");
    }
  }
}
