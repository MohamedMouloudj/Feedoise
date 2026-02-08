import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a more readable format based on the provided locale.
 * @param dateString - The date string to be formatted.
 * @param locale - The locale to use for formatting the date (default is "en-US").
 * @returns A formatted date string according to the specified locale.
 */
export function formatDate(dateString: string, locale: string = "en-US") {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
