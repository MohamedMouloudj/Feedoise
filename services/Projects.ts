import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { ProjectRole } from "@/lib/generated/prisma/enums";

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
}
