import { z } from "zod";

/**
 * Organization creation schema
 * Validates organization name and slug based on Prisma model requirements
 */
export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters")
    .trim(),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .min(2, "URL slug must be at least 2 characters")
    .max(50, "URL slug must not exceed 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "URL slug must contain only lowercase letters, numbers, and hyphens",
    )
    .regex(/^[a-z0-9]/, "URL slug must start with a letter or number")
    .regex(/[a-z0-9]$/, "URL slug must end with a letter or number")
    .toLowerCase()
    .trim(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
