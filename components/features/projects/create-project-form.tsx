"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AppButton from "@/components/AppButton";
import { createProject } from "@/actions/projects.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CreateProjectFormData,
  createProjectSchema,
} from "@/schemas/project.schema";

type CreateProjectFormProps = {
  organizationId: string;
  onSuccess?: () => void;
};

export function CreateProjectForm({
  organizationId,
  onSuccess,
}: CreateProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      isPublic: true,
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    const autoSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50);
    setValue("slug", autoSlug);
  };

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      startTransition(async () => {
        const result = await createProject({
          organizationId,
          name: data.name,
          description: data.description || undefined,
          slug: data.slug,
          isPublic: data.isPublic,
        });

        if (result.success) {
          toast.success("Project created successfully!");
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/space/projects");
          }
        } else {
          toast.error(result.error || "Failed to create project");
        }
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                id="name"
                placeholder="My Awesome Project"
                onChange={(e) => {
                  field.onChange(e);
                  handleNameChange(e.target.value);
                }}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug *</Label>
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                {...field}
                id="slug"
                placeholder="my-awesome-project"
                disabled={isSubmitting}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: /projects/
                {field.value || "your-slug"}
              </p>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Textarea
                {...field}
                id="description"
                placeholder="Tell us about your project..."
                rows={4}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="isPublic">Public Project</Label>
          <p className="text-sm text-muted-foreground">
            Allow anyone to discover and view this project
          </p>
        </div>
        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <Switch
              id="isPublic"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="flex gap-3">
        <AppButton
          type="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </AppButton>
        <AppButton
          type="primary-submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </AppButton>
      </div>
    </form>
  );
}
