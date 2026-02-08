"use client";

import { LingoDotDevEngine } from "lingo.dev";

// Initialize SDK instance (client-side only)
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.NEXT_PUBLIC_LINGODOTDEV_API_KEY!,
});

/**
 * Translate content object from source to target language
 * Uses localizeObject for nested object translation
 */
export async function translateContent(
  content: { [key: string]: string },
  sourceLocale: string,
  targetLocale: string,
): Promise<{ [key: string]: string }> {
  // If same language, return original
  if (sourceLocale === targetLocale) {
    return content;
  }

  try {
    const translated = await lingoDotDev.localizeObject(content, {
      sourceLocale,
      targetLocale,
    });
    return translated as { [key: string]: string };
  } catch (error) {
    console.error("Translation failed:", error);
    // Return original content on error
    return content;
  }
}

/**
 * Translate a single text string
 * Uses localizeText for simple string translation
 */
export async function translateText(
  text: string,
  sourceLocale: string,
  targetLocale: string,
): Promise<string> {
  if (sourceLocale === targetLocale) {
    return text;
  }

  try {
    const translated = await lingoDotDev.localizeText(text, {
      sourceLocale,
      targetLocale,
    });
    return translated;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
}

/**
 * Batch translate multiple threads efficiently
 * Groups by source language and translates in batches
 */
export async function batchTranslateThreads(
  threads: Array<{
    id: string;
    title: string;
    content?: string;
    originalLanguage: string;
  }>,
  targetLocale: string,
): Promise<
  Array<{
    id: string;
    title: string;
    content?: string;
  }>
> {
  // Filter threads that need translation
  const threadsToTranslate = threads.filter(
    (t) => t.originalLanguage !== targetLocale,
  );

  // If no threads need translation, return originals
  if (threadsToTranslate.length === 0) {
    return threads.map((t) => ({
      id: t.id,
      title: t.title,
      content: t.content,
    }));
  }

  // Group by source language for efficient batching
  const byLanguage = threadsToTranslate.reduce(
    (acc, thread) => {
      if (!acc[thread.originalLanguage]) {
        acc[thread.originalLanguage] = [];
      }
      acc[thread.originalLanguage].push(thread);
      return acc;
    },
    {} as Record<
      string,
      Array<{
        id: string;
        title: string;
        content?: string;
        originalLanguage: string;
      }>
    >,
  );

  try {
    // Batch translate per language pair
    const translationPromises = Object.entries(byLanguage).map(
      async ([sourceLocale, items]) => {
        // Create object with thread IDs as keys
        const contentToTranslate = Object.fromEntries(
          items.map((t) => [t.id, t.title]),
        );

        const translated = await lingoDotDev.localizeObject(
          contentToTranslate,
          {
            sourceLocale,
            targetLocale,
          },
        );

        return {
          sourceLocale,
          translated: translated as Record<string, string>,
        };
      },
    );

    const results = await Promise.all(translationPromises);

    // Create translation map
    const translationMap = new Map<string, string>();
    results.forEach(({ translated }) => {
      Object.entries(translated).forEach(([id, title]) => {
        translationMap.set(id, title);
      });
    });

    // Return threads with translations
    return threads.map((thread) => ({
      id: thread.id,
      title: translationMap.get(thread.id) || thread.title,
      content: thread.content,
    }));
  } catch (error) {
    console.error("Batch translation failed:", error);
    // Return original threads on error
    return threads.map((t) => ({
      id: t.id,
      title: t.title,
      content: t.content,
    }));
  }
}
