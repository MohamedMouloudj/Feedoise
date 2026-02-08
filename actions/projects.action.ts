"use server";

import {
  ProjectsService,
  CreateProjectData,
  UpdateProjectData,
} from "@/services/Projects";
import { getUserPermissions } from "@/services/permissions";
import { hasPermission } from "@/lib/permissions";
import { getUserSession } from "./session-helper.action";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Create a new project.
 */
export async function createProject(
  data: CreateProjectData,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      data.organizationId,
    );

    if (!hasPermission(permissions, "project:create")) {
      return { success: false, error: "Insufficient permissions" };
    }

    const project = await ProjectsService.create(data);

    return { success: true, data: project };
  } catch (error) {
    console.error("Error in createProject action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

/**
 * Update a project.
 */
export async function updateProject(
  projectId: string,
  data: UpdateProjectData,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get project to check organization
    const project = await ProjectsService.findById(projectId);
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      project.organizationId,
      projectId,
    );

    if (!hasPermission(permissions, "project:update")) {
      return { success: false, error: "Insufficient permissions" };
    }

    const updatedProject = await ProjectsService.update(projectId, data);

    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Error in updateProject action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

/**
 * Delete a project.
 */
export async function deleteProject(
  projectId: string,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get project to check organization
    const project = await ProjectsService.findById(projectId);
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      project.organizationId,
      projectId,
    );

    if (!hasPermission(permissions, "project:delete")) {
      return { success: false, error: "Insufficient permissions" };
    }

    await ProjectsService.delete(projectId);

    return { success: true };
  } catch (error) {
    console.error("Error in deleteProject action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

/**
 * Follow a project.
 */
export async function followProject(
  projectId: string,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await ProjectsService.follow(session.user.id, projectId);

    return { success: true };
  } catch (error) {
    console.error("Error in followProject action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to follow project",
    };
  }
}

/**
 * Unfollow a project.
 */
export async function unfollowProject(
  projectId: string,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await ProjectsService.unfollow(session.user.id, projectId);

    return { success: true };
  } catch (error) {
    console.error("Error in unfollowProject action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to unfollow project",
    };
  }
}
