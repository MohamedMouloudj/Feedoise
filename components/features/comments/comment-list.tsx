import { CommentWithAuthor } from "@/services/Comments";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type CommentListProps = {
  comments: CommentWithAuthor[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-8 text-center">
        <p className="text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <div key={comment.id}>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {comment.author.image ? (
                <Image
                  src={comment.author.image}
                  alt={comment.author.name || "User"}
                  className="h-10 w-10 rounded-full"
                  width={40}
                  height={40}
                />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">
                  {comment.author.name || comment.author.email}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-xs text-muted-foreground">
                  · Originally in {comment.originalLanguage.toUpperCase()}
                </span>
              </div>

              <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
            </div>
          </div>

          {index < comments.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  );
}
