import { z } from "zod";

/**
 * Supported languages in the application
 * Mutchs LANGUAGES constant from config
 */
const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "ar",
  "zh",
  "ru",
  "hi",
  "pt",
] as const;

/**
 * Language selection schema
 * Validates user's preferred language selection during onboarding
 */
export const languageSchema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES, {
    message: "Please select a valid language",
  }),
});

export type LanguageFormData = z.infer<typeof languageSchema>;

/**
 * Type for supported language codes
 */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
