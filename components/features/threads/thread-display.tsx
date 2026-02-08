"use client";

import { TranslatedThread } from "@/components/features/translations/translated-thread";
import { LanguageBadge } from "@/components/ui/language-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/features/threads/status-badge";
import { PriorityIndicator } from "@/components/features/threads/priority-indicator";
import { User, Calendar, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ThreadStatus } from "@/lib/generated/prisma/client";

interface ThreadDisplayProps {
  thread: {
    id: string;
    title: string;
    content: string;
    originalLanguage: string;
    status: ThreadStatus;
    priorityWeight: number;
    createdAt: Date;
    author: {
      name: string | null;
      email: string;
    };
    _count: {
      comments: number;
    };
    project: {
      name: string;
    };
  };
  userLanguage: string;
}

export function ThreadDisplay({ thread, userLanguage }: ThreadDisplayProps) {
  return (
    <TranslatedThread
      thread={thread}
      userLanguage={userLanguage}
    >
      {({
        title,
        content,
        isTranslating,
        showOriginal,
        toggleOriginal,
        needsTranslation,
      }) => (
        <>
          {/* Thread Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">
                    {isTranslating ? (
                      <Skeleton className="h-10 w-3/4" />
                    ) : (
                      title
                    )}
                  </h1>
                  {needsTranslation && (
                    <LanguageBadge
                      language={thread.originalLanguage}
                      showingOriginal={showOriginal}
                      onToggle={toggleOriginal}
                      size="sm"
                    />
                  )}
                </div>
              </div>
              <StatusBadge status={thread.status} />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{thread.author.name || thread.author.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(thread.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{thread._count.comments} comments</span>
              </div>

              {thread.priorityWeight > 0 && (
                <PriorityIndicator priority={thread.priorityWeight} />
              )}
            </div>

            <div className="whitespace-pre-wrap text-muted-foreground">
              {isTranslating ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : (
                content
              )}
            </div>
          </div>
        </>
      )}
    </TranslatedThread>
  );
}
