import { prisma } from "@/lib/db";
import { ProjectRole } from "@/lib/generated/prisma/enums";

/**
 * Service class for project-related operations.
 */
export class ProjectsService {
  /**
   * Get a user's role in a specific project.
   * @param userId - The ID of the user.
   * @param projectId - The ID of the project.
   * @returns The user's `role in the project` ("maintainer", "contributor") or `null` if not a member.
   */
  static async getUserRoleInProject(
    userId: string,
    projectId: string,
  ): Promise<ProjectRole | null> {
    const membership = await prisma.projectMember.findFirst({
      where: {
        userId,
        projectId,
      },
      select: {
        role: true,
      },
    });
    return membership ? membership.role : null;
  }
}
