"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AppButton from "@/components/AppButton";
import { createThread } from "@/actions/threads.action";
import { toast } from "sonner";

const createThreadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content is too long"),
});

type CreateThreadFormData = z.infer<typeof createThreadSchema>;

type CreateThreadFormProps = {
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateThreadForm({
  projectId,
  onSuccess,
  onCancel,
}: CreateThreadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateThreadFormData>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: CreateThreadFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createThread(projectId, data);

      if (result.success) {
        toast.success("Feedback submitted successfully!");
        reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating thread:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                id="title"
                placeholder="Brief summary of your feedback"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Description *</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Textarea
                {...field}
                id="content"
                placeholder="Describe your feedback in detail..."
                rows={6}
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

      <div className="flex gap-3">
        {onCancel && (
          <AppButton
            type="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </AppButton>
        )}
        <AppButton
          type="primary-submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </AppButton>
      </div>
    </form>
  );
}
