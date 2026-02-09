import Link from "next/link";
import { ThreadWithAuthor } from "@/services/Threads";
import { StatusBadge } from "./status-badge";
import { PriorityIndicator } from "./priority-indicator";
import { MessageSquare, User, Calendar, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ThreadCardProps = {
  thread: ThreadWithAuthor;
  projectSlug: string;
  translatedTitle?: string;
  showLanguageBadge?: boolean;
};

export function ThreadCard({
  thread,
  projectSlug,
  translatedTitle,
  showLanguageBadge = false,
}: ThreadCardProps) {
  return (
    <Link href={`/projects/${projectSlug}/threads/${thread.id}`}>
      <div className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="flex-1 text-lg font-semibold text-foreground group-hover:text-primary">
            {translatedTitle || thread.title}
          </h3>
          <div className="flex items-center gap-2">
            {showLanguageBadge && (
              <div
                className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                title={`Originally in ${thread.originalLanguage.toUpperCase()}`}
              >
                <Globe className="h-3 w-3" />
                {thread.originalLanguage.toUpperCase()}
              </div>
            )}
            <StatusBadge status={thread.status} />
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {thread.content}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{thread.author.name || thread.author.email}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(thread.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{thread._count.comments} comments</span>
          </div>

          {thread.priorityWeight > 0 && (
            <PriorityIndicator
              priority={thread.priorityWeight}
              showLabel={false}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
