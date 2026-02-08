import { prisma } from "@/lib/db";
import { Prisma, ThreadStatus } from "@/lib/generated/prisma/client";

export type ThreadWithAuthor = Prisma.ThreadGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    _count: {
      select: {
        comments: true;
      };
    };
  };
}>;

export type ThreadWithDetails = Prisma.ThreadGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    assignedUser: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
    project: {
      select: {
        id: true;
        name: true;
        slug: true;
        organizationId: true;
      };
    };
    _count: {
      select: {
        comments: true;
      };
    };
  };
}>;

export type CreateThreadData = {
  projectId: string;
  authorId: string;
  title: string;
  content: string;
  originalLanguage: string;
};

export type UpdateThreadData = {
  title?: string;
  content?: string;
  status?: ThreadStatus;
  priorityWeight?: number;
  assignedTo?: string | null;
};

export type ThreadFilters = {
  status?: ThreadStatus;
  sortBy?: "recent" | "priority" | "discussed";
};

/**
 * Service class for thread-related operations.
 */
export class ThreadsService {
  /**
   * Create a new thread.
   */
  static async create(data: CreateThreadData): Promise<ThreadWithAuthor> {
    try {
      const thread = await prisma.thread.create({
        data: {
          projectId: data.projectId,
          authorId: data.authorId,
          title: data.title,
          content: data.content,
          originalLanguage: data.originalLanguage,
          status: "new",
          priorityWeight: 0,
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return thread;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003: Foreign key constraint failed
        if (error.code === "P2003") {
          throw new Error("Invalid project or author ID");
        }
      }

      console.error("Error creating thread:", error);
      throw new Error("Failed to create thread");
    }
  }

  /**
   * Find a thread by ID with full details.
   */
  static async findById(id: string): Promise<ThreadWithDetails | null> {
    try {
      const thread = await prisma.thread.findUnique({
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
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
              organizationId: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return thread;
    } catch (error) {
      console.error("Error finding thread:", error);
      throw new Error("Failed to find thread");
    }
  }

  /**
   * Find all threads in a project with optional filters.
   */
  static async findByProject(
    projectId: string,
    filters?: ThreadFilters,
  ): Promise<ThreadWithAuthor[]> {
    try {
      const where: Prisma.ThreadWhereInput = {
        projectId,
        ...(filters?.status && { status: filters.status }),
      };

      let orderBy: Prisma.ThreadOrderByWithRelationInput = {};

      switch (filters?.sortBy) {
        case "priority":
          orderBy = { priorityWeight: "desc" };
          break;
        case "discussed":
          orderBy = { comments: { _count: "desc" } };
          break;
        case "recent":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }

      const threads = await prisma.thread.findMany({
        where,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return threads;
    } catch (error) {
      console.error("Error finding threads by project:", error);
      throw new Error("Failed to retrieve threads");
    }
  }

  /**
   * Find all threads created by a user.
   */
  static async findByAuthor(authorId: string): Promise<ThreadWithAuthor[]> {
    try {
      const threads = await prisma.thread.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return threads;
    } catch (error) {
      console.error("Error finding threads by author:", error);
      throw new Error("Failed to retrieve user threads");
    }
  }

  /**
   * Update a thread.
   */
  static async update(
    id: string,
    data: UpdateThreadData,
  ): Promise<ThreadWithDetails> {
    try {
      const thread = await prisma.thread.update({
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
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
              organizationId: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return thread;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === "P2025") {
          throw new Error("Thread not found");
        }
        // P2003: Foreign key constraint failed
        if (error.code === "P2003") {
          throw new Error("Invalid assigned user ID");
        }
      }

      console.error("Error updating thread:", error);
      throw new Error("Failed to update thread");
    }
  }

  /**
   * Delete a thread.
   */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.thread.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === "P2025") {
          throw new Error("Thread not found");
        }
      }

      console.error("Error deleting thread:", error);
      throw new Error("Failed to delete thread");
    }
  }

  /**
   * Get thread count for a project.
   */
  static async countByProject(projectId: string): Promise<number> {
    try {
      return await prisma.thread.count({
        where: { projectId },
      });
    } catch (error) {
      console.error("Error counting threads:", error);
      throw new Error("Failed to count threads");
    }
  }
}
