/**
 * Centralized exports for all Zod validation schemas
 *
 * This file provides a single entry point for importing schemas across the application.
 * All schemas are grouped semantically and respect Prisma model types.
 *
 * Usage:
 * ```tsx
 * import { loginSchema, signupSchema } from "@/schemas";
 * import { organizationSchema } from "@/schemas";
 * ```
 */

// Auth-related schemas
export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginFormData,
  type SignupFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "./auth.schema";

// Organization-related schemas
export {
  organizationSchema,
  type OrganizationFormData,
} from "./organization.schema";

// Onboarding-related schemas
export {
  languageSchema,
  type LanguageFormData,
  type SupportedLanguage,
} from "./onboarding.schema";
