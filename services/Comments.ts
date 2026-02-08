import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
  };
}>;

export type CreateCommentData = {
  threadId: string;
  authorId: string;
  content: string;
  originalLanguage: string;
};

export type UpdateCommentData = {
  content: string;
};

/**
 * Service class for comment-related operations.
 */
export class CommentsService {
  /**
   * Create a new comment.
   */
  static async create(data: CreateCommentData): Promise<CommentWithAuthor> {
    try {
      const comment = await prisma.comment.create({
        data: {
          threadId: data.threadId,
          authorId: data.authorId,
          content: data.content,
          originalLanguage: data.originalLanguage,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Foreign key constraint failed
        if (error.code === "P2003") {
          throw new Error("Invalid thread or author ID");
        }
      }

      console.error("Error creating comment:", error);
      throw new Error("Failed to create comment");
    }
  }

  /**
   * Find all comments for a thread.
   */
  static async findByThread(threadId: string): Promise<CommentWithAuthor[]> {
    try {
      const comments = await prisma.comment.findMany({
        where: { threadId },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return comments;
    } catch (error) {
      console.error("Error finding comments:", error);
      throw new Error("Failed to retrieve comments");
    }
  }

  /**
   * Find a comment by ID.
   */
  static async findById(id: string): Promise<CommentWithAuthor | null> {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      console.error("Error finding comment:", error);
      throw new Error("Failed to find comment");
    }
  }

  /**
   * Update a comment.
   */
  static async update(
    id: string,
    data: UpdateCommentData,
  ): Promise<CommentWithAuthor> {
    try {
      const comment = await prisma.comment.update({
        where: { id },
        data,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === "P2025") {
          throw new Error("Comment not found");
        }
      }

      console.error("Error updating comment:", error);
      throw new Error("Failed to update comment");
    }
  }

  /**
   * Delete a comment.
   */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === "P2025") {
          throw new Error("Comment not found");
        }
      }

      console.error("Error deleting comment:", error);
      throw new Error("Failed to delete comment");
    }
  }
}
