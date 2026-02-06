"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createOrganization } from "@/actions/organizations.action";
import AppButton from "@/components/AppButton";

interface OrganizationFormData {
  name: string;
  slug: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<OrganizationFormData>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      const result = await createOrganization({
        name: data.name,
        slug: data.slug,
      });
      if (result.success) {
        toast.success("Organization created!");
        router.push("/dashboard");
      } else {
        toast.error(result.error);
      }
    } catch (_error) {
      toast.error("Failed to create organization");
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="mb-2 text-3xl font-bold">Welcome!</h1>
      <p className="mb-8 text-muted-foreground">
        Create an organization to get started, or skip now.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Organization name is required",
              minLength: {
                value: 2,
                message: "Organization name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Organization name must not exceed 100 characters",
              },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  id="name"
                  placeholder="Acme Inc"
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-generate slug when typing if slug is empty or matches previous auto-generated value
                    const currentSlug = getValues("slug");
                    const previousSlug = generateSlug(field.value);

                    if (!currentSlug || currentSlug === previousSlug) {
                      setValue("slug", generateSlug(e.target.value));
                    }
                  }}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Controller
            name="slug"
            control={control}
            rules={{
              required: "URL slug is required",
              minLength: {
                value: 2,
                message: "URL slug must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "URL slug must not exceed 50 characters",
              },
              pattern: {
                value: /^[a-z0-9-]+$/,
                message:
                  "URL slug must contain only lowercase letters, numbers, and hyphens",
              },
            }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Input
                  {...field}
                  id="slug"
                  placeholder="acme-inc"
                  onChange={(e) => {
                    // Ensure slug follows the pattern
                    const value = e.target.value.toLowerCase();
                    field.onChange(value);
                  }}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
                {!fieldState.error && field.value && (
                  <p className="text-sm text-muted-foreground">
                    Your organization will be available at: /{field.value}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <AppButton
          type="primary-submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Creating..." : "Create Organization"}
        </AppButton>

        <AppButton type="outline" onClick={handleSkip} className="w-full">
          Skip for now
        </AppButton>
      </form>
    </div>
  );
}
