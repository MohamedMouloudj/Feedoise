"use server";

import {
  ThreadsService,
  CreateThreadData,
  UpdateThreadData,
} from "@/services/Threads";
import { ProjectsService } from "@/services/Projects";
import { getUserPermissions } from "@/services/permissions";
import { hasPermission } from "@/lib/permissions";
import { getUserSession } from "./session-helper.action";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Create a new thread.
 */
export async function createThread(
  projectId: string,
  data: Omit<CreateThreadData, "projectId" | "authorId" | "originalLanguage">,
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

    if (!hasPermission(permissions, "thread:create")) {
      return { success: false, error: "Insufficient permissions" };
    }

    const thread = await ThreadsService.create({
      ...data,
      projectId,
      authorId: session.user.id,
      originalLanguage: session.user.preferredLanguage || "en",
    });

    return { success: true, data: thread };
  } catch (error) {
    console.error("Error in createThread action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create thread",
    };
  }
}

/**
 * Update a thread.
 */
export async function updateThread(
  threadId: string,
  data: UpdateThreadData,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get thread to check permissions
    const thread = await ThreadsService.findById(threadId);
    if (!thread) {
      return { success: false, error: "Thread not found" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      thread.project.organizationId,
      thread.projectId,
    );

    // Check what's being updated and verify permissions
    const isOwn = thread.authorId === session.user.id;

    if (data.title || data.content) {
      const canUpdate = isOwn
        ? hasPermission(permissions, "thread:update:own")
        : hasPermission(permissions, "thread:update:any");

      if (!canUpdate) {
        return {
          success: false,
          error: "Insufficient permissions to update thread",
        };
      }
    }

    if (data.status !== undefined) {
      if (!hasPermission(permissions, "thread:status:update")) {
        return {
          success: false,
          error: "Insufficient permissions to update status",
        };
      }
    }

    if (data.priorityWeight !== undefined) {
      if (!hasPermission(permissions, "thread:priority:update")) {
        return {
          success: false,
          error: "Insufficient permissions to update priority",
        };
      }
    }

    if (data.assignedTo !== undefined) {
      if (!hasPermission(permissions, "thread:assign")) {
        return {
          success: false,
          error: "Insufficient permissions to assign thread",
        };
      }
    }

    const updatedThread = await ThreadsService.update(threadId, data);

    return { success: true, data: updatedThread };
  } catch (error) {
    console.error("Error in updateThread action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update thread",
    };
  }
}

/**
 * Delete a thread.
 */
export async function deleteThread(threadId: string): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get thread to check permissions
    const thread = await ThreadsService.findById(threadId);
    if (!thread) {
      return { success: false, error: "Thread not found" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      thread.project.organizationId,
      thread.projectId,
    );

    const isOwn = thread.authorId === session.user.id;
    const canDelete = isOwn
      ? hasPermission(permissions, "thread:delete:own")
      : hasPermission(permissions, "thread:delete:any");

    if (!canDelete) {
      return { success: false, error: "Insufficient permissions" };
    }

    await ThreadsService.delete(threadId);

    return { success: true };
  } catch (error) {
    console.error("Error in deleteThread action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete thread",
    };
  }
}
