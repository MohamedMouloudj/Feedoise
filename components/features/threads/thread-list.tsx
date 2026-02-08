"use client";

import { useState } from "react";
import { ThreadWithAuthor } from "@/services/Threads";
import { ThreadCard } from "./thread-card";
import { ThreadFilters } from "./thread-filters";
import { useBatchTranslation } from "@/hooks/use-batch-translation";
import { Skeleton } from "@/components/ui/skeleton";
import { ThreadStatus } from "@/lib/generated/prisma/client";

type ThreadListProps = {
  threads: ThreadWithAuthor[];
  projectSlug: string;
  userLanguage: string;
};

export function ThreadList({
  threads,
  projectSlug,
  userLanguage,
}: ThreadListProps) {
  const [statusFilter, setStatusFilter] = useState<ThreadStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "priority" | "discussed">(
    "recent",
  );

  // Batch translate threads
  const { translatedThreads, isTranslating } = useBatchTranslation(
    threads,
    userLanguage,
  );

  // Filter threads
  const filteredThreads = threads.filter((thread) => {
    if (statusFilter === "all") return true;
    return thread.status === statusFilter;
  });

  // Sort threads
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return b.priorityWeight - a.priorityWeight;
      case "discussed":
        return b._count.comments - a._count.comments;
      case "recent":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return (
    <div className="space-y-6">
      <ThreadFilters
        selectedStatus={statusFilter}
        selectedSort={sortBy}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
      />

      {isTranslating ? (
        <div className="space-y-4">
          {sortedThreads.map((thread) => (
            <Skeleton key={thread.id} className="h-48 w-full" />
          ))}
        </div>
      ) : sortedThreads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <h3 className="mb-2 text-lg font-semibold">No feedback yet</h3>
          <p className="text-muted-foreground">
            {statusFilter !== "all"
              ? `No threads with status "${statusFilter}"`
              : "Be the first to share your feedback"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedThreads.map((thread, index) => {
            const translatedThread = translatedThreads.find(
              (t) => t.id === thread.id,
            );
            return (
              <ThreadCard
                key={thread.id}
                thread={thread}
                projectSlug={projectSlug}
                translatedTitle={translatedThread?.title}
                showLanguageBadge={thread.originalLanguage !== userLanguage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
