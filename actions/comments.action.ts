"use server";


import {
  CommentsService,
  CreateCommentData,
  UpdateCommentData,
} from "@/services/Comments";
import { ThreadsService } from "@/services/Threads";
import { getUserPermissions } from "@/services/permissions";
import { hasPermission } from "@/lib/permissions";
import { getUserSession } from "./session-helper.action";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Create a new comment.
 */
export async function createComment(
  threadId: string,
  content: string,
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

    if (!hasPermission(permissions, "comment:create")) {
      return { success: false, error: "Insufficient permissions" };
    }

    const commentData: CreateCommentData = {
      threadId,
      authorId: session.user.id,
      content,
      originalLanguage: session.user.preferredLanguage || "en",
    };

    const comment = await CommentsService.create(commentData);

    return { success: true, data: comment };
  } catch (error) {
    console.error("Error in createComment action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create comment",
    };
  }
}

/**
 * Update a comment.
 */
export async function updateComment(
  commentId: string,
  content: string,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get comment to check permissions
    const comment = await CommentsService.findById(commentId);
    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    // Get thread to check permissions
    const thread = await ThreadsService.findById(comment.threadId);
    if (!thread) {
      return { success: false, error: "Thread not found" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      thread.project.organizationId,
      thread.projectId,
    );

    const isOwn = comment.authorId === session.user.id;
    const canUpdate = isOwn
      ? hasPermission(permissions, "comment:update:own")
      : hasPermission(permissions, "comment:update:any");

    if (!canUpdate) {
      return { success: false, error: "Insufficient permissions" };
    }

    const updateData: UpdateCommentData = { content };
    const updatedComment = await CommentsService.update(commentId, updateData);

    return { success: true, data: updatedComment };
  } catch (error) {
    console.error("Error in updateComment action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update comment",
    };
  }
}

/**
 * Delete a comment.
 */
export async function deleteComment(
  commentId: string,
): Promise<ActionResponse> {
  try {
    const session = await getUserSession();

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get comment to check permissions
    const comment = await CommentsService.findById(commentId);
    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    // Get thread to check permissions
    const thread = await ThreadsService.findById(comment.threadId);
    if (!thread) {
      return { success: false, error: "Thread not found" };
    }

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      thread.project.organizationId,
      thread.projectId,
    );

    const isOwn = comment.authorId === session.user.id;
    const canDelete = isOwn
      ? hasPermission(permissions, "comment:delete:own")
      : hasPermission(permissions, "comment:delete:any");

    if (!canDelete) {
      return { success: false, error: "Insufficient permissions" };
    }

    await CommentsService.delete(commentId);

    return { success: true };
  } catch (error) {
    console.error("Error in deleteComment action:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
}
