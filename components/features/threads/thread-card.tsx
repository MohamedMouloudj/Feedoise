import Link from "next/link";
import { ThreadWithAuthor } from "@/services/Threads";
import { StatusBadge } from "./status-badge";
import { PriorityIndicator } from "./priority-indicator";
import { MessageSquare, User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ThreadCardProps = {
  thread: ThreadWithAuthor;
  projectSlug: string;
};

export function ThreadCard({ thread, projectSlug }: ThreadCardProps) {
  return (
    <Link href={`/projects/${projectSlug}/threads/${thread.id}`}>
      <div className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="flex-1 text-lg font-semibold text-foreground group-hover:text-primary">
            {thread.title}
          </h3>
          <StatusBadge status={thread.status} />
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

          <span className="text-xs text-muted-foreground">
            Originally in {thread.originalLanguage.toUpperCase()}
          </span>
        </div>
      </div>
    </Link>
  );
}
