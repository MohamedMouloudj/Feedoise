"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AppButton from "@/components/AppButton";
import { createComment } from "@/actions/comments.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment is too long"),
});

type CreateCommentFormData = z.infer<typeof createCommentSchema>;

type CreateCommentFormProps = {
  threadId: string;
  onSuccess?: () => void;
};

export function CreateCommentForm({
  threadId,
  onSuccess,
}: CreateCommentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CreateCommentFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createComment(threadId, data.content);

      if (result.success) {
        toast.success("Comment added!");
        reset();
        router.refresh();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Add a comment</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Textarea
                {...field}
                id="content"
                placeholder="Share your thoughts..."
                rows={4}
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex justify-end">
        <AppButton type="primary-submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </AppButton>
      </div>
    </form>
  );
}
