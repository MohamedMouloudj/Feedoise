import { notFound } from "next/navigation";
import { ThreadsService } from "@/services/Threads";
import { CommentsService } from "@/services/Comments";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserPermissions } from "@/services/permissions";
import { hasPermission } from "@/lib/permissions";
import { StatusBadge } from "@/components/features/threads/status-badge";
import { PriorityIndicator } from "@/components/features/threads/priority-indicator";
import { CommentList } from "@/components/features/comments/comment-list";
import { CreateCommentForm } from "@/components/features/comments/create-comment-form";
import { ThreadStatusSelector } from "@/components/features/threads/thread-status-selector";
import { ThreadPrioritySelector } from "@/components/features/threads/thread-priority-selector";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import AppButton from "@/components/AppButton";

type ThreadDetailPageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function ThreadDetailPage({
  params,
}: ThreadDetailPageProps) {
  const { slug, id } = await params;

  // Get thread details
  const thread = await ThreadsService.findById(id);

  if (!thread) {
    notFound();
  }

  // Get comments
  const comments = await CommentsService.findByThread(id);

  // Check user permissions
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let canUpdateStatus = false;
  let canUpdatePriority = false;
  let canAssign = false;

  if (session?.user) {
    const permissions = await getUserPermissions(
      session.user.id,
      thread.project.organizationId,
      thread.projectId,
    );

    canUpdateStatus = hasPermission(permissions, "thread:status:update");
    canUpdatePriority = hasPermission(permissions, "thread:priority:update");
    canAssign = hasPermission(permissions, "thread:assign");
  }

  return (
    <div className="container max-w-full p-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <AppButton
          href={`/projects/${slug}`}
          className="hover:text-foreground"
          type="ghost"
          icon={<ArrowLeft />}
          size="sm"
          dir={session?.user.preferredLanguage === "ar" ? "ltr" : "rtl"}
        >
          Back to {thread.project.name}
        </AppButton>
      </div>

      {/* Thread Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="flex-1 text-3xl font-bold">{thread.title}</h1>
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

          <span className="text-xs">
            Originally in {thread.originalLanguage.toUpperCase()}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-muted-foreground">
          {thread.content}
        </p>
      </div>

      {/* Management Controls */}
      {(canUpdateStatus || canUpdatePriority || canAssign) && (
        <>
          <div className="mb-8 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-lg font-semibold">Manage Thread</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {canUpdateStatus && (
                <ThreadStatusSelector
                  threadId={thread.id}
                  currentStatus={thread.status}
                  canUpdate={canUpdateStatus}
                />
              )}

              {canUpdatePriority && (
                <ThreadPrioritySelector
                  threadId={thread.id}
                  currentPriority={thread.priorityWeight}
                  canUpdate={canUpdatePriority}
                />
              )}

              {/* TODO: Add assign functionality in future */}
              {/* {canAssign && (
                <ThreadAssignSelector
                  threadId={thread.id}
                  currentAssignee={thread.assignedTo}
                  canUpdate={canAssign}
                />
              )} */}
            </div>
          </div>
          <Separator className="my-8" />
        </>
      )}

      {/* Comments Section */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Comments ({comments.length})
        </h2>
        <CommentList comments={comments} />
      </div>

      {/* Add Comment Form */}
      {session?.user && (
        <>
          <Separator className="my-8" />
          <div>
            <CreateCommentForm threadId={thread.id} />
          </div>
        </>
      )}
    </div>
  );
}
