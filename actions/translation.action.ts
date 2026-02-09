"use server";

import {
  translateContent,
  translateText,
  batchTranslateThreads,
} from "@/lib/lingo";

/**
 * Server action to translate content using Lingo.dev SDK. This is a thin wrapper around the core translation functions in lib/lingo.ts, designed to be called from client components. It handles errors gracefully and returns a consistent response shape.
 * @param content - An object containing the content to be translated, where keys are identifiers and values are the text to translate.
 * @param sourceLocale - The original language of the content (e.g., "en", "fr").
 * @param targetLocale - The desired language to translate the content into.
 * @returns An object indicating success or failure, along with the translated content or error message.
 */
export async function translateContentAction(
  content: { [key: string]: string },
  sourceLocale: string,
  targetLocale: string,
) {
  try {
    const translated = await translateContent(
      content,
      sourceLocale,
      targetLocale,
    );
    return { success: true, data: translated };
  } catch (error) {
    console.error("Translation action failed:", error);
    return { success: false, error: "Translation failed", data: content };
  }
}

export async function translateTextAction(
  text: string,
  sourceLocale: string,
  targetLocale: string,
) {
  try {
    const translated = await translateText(text, sourceLocale, targetLocale);
    return { success: true, data: translated };
  } catch (error) {
    console.error("Translation action failed:", error);
    return { success: false, error: "Translation failed", data: text };
  }
}

/**
 * Server action to batch translate multiple threads efficiently. It groups threads by their original language to minimize API calls to the translation service. Each thread's title and content (if available) are translated.
 * @param threads - An array of thread objects, each containing an id, title, optional content, and original language.
 * @param targetLocale - The desired language to translate the threads into.
 * @returns An object indicating success or failure, along with the array of translated threads or error message.
 */
export async function batchTranslateThreadsAction(
  threads: Array<{
    id: string;
    title: string;
    content?: string;
    originalLanguage: string;
  }>,
  targetLocale: string,
) {
  try {
    const translated = await batchTranslateThreads(threads, targetLocale);
    return { success: true, data: translated };
  } catch (error) {
    console.error("Batch translation action failed:", error);
    return {
      success: false,
      error: "Translation failed",
      data: threads.map((t) => ({
        id: t.id,
        translatedTitle: t.title,
        translatedContent: t.content,
      })),
    };
  }
}
