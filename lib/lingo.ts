import { LingoDotDevEngine } from "lingo.dev/sdk";

// Server-side SDK instance
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY!, // Note: Not NEXT_PUBLIC (server-only)
});

/**
 * Translate content object from source to target language
 * SERVER-SIDE ONLY - Do not import in client components
 */
export async function translateContent(
  content: { [key: string]: string },
  sourceLocale: string,
  targetLocale: string,
): Promise<{ [key: string]: string }> {
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
    return content;
  }
}

/**
 * Translate a single text string
 * SERVER-SIDE ONLY
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
 * Batch translate multiple items efficiently. It groups items by source language to minimize API calls.
 * SERVER-SIDE ONLY
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
    translatedTitle: string;
    translatedContent?: string;
  }>
> {
  const threadsToTranslate = threads.filter(
    (t) => t.originalLanguage !== targetLocale,
  );

  if (threadsToTranslate.length === 0) {
    return threads.map((t) => ({
      id: t.id,
      translatedTitle: t.title,
      translatedContent: t.content,
    }));
  }

  // Group by source language
  const byLanguage = threadsToTranslate.reduce(
    (acc, thread) => {
      if (!acc[thread.originalLanguage]) {
        acc[thread.originalLanguage] = [];
      }
      acc[thread.originalLanguage].push(thread);
      return acc;
    },
    {} as Record<string, typeof threadsToTranslate>,
  );

  try {
    const translationPromises = Object.entries(byLanguage).map(
      async ([sourceLocale, items]) => {
        const contentToTranslate = Object.fromEntries(
          items.flatMap((t) => {
            const entries = [[`${t.id}_title`, t.title]];
            if (t.content) {
              entries.push([`${t.id}_content`, t.content]);
            }
            return entries;
          }),
        );

        const translated = await lingoDotDev.localizeObject(
          contentToTranslate,
          { sourceLocale, targetLocale },
        );

        return translated as Record<string, string>;
      },
    );

    const results = await Promise.all(translationPromises);

    // Merge results
    const translationMap = new Map<string, string>();
    results.forEach((translated) => {
      Object.entries(translated).forEach(([key, value]) => {
        translationMap.set(key, value);
      });
    });

    // Return with translations
    return threads.map((thread) => ({
      id: thread.id,
      translatedTitle: translationMap.get(`${thread.id}_title`) || thread.title,
      translatedContent: thread.content
        ? translationMap.get(`${thread.id}_content`) || thread.content
        : undefined,
    }));
  } catch (error) {
    console.error("Batch translation failed:", error);
    return threads.map((t) => ({
      id: t.id,
      translatedTitle: t.title,
      translatedContent: t.content,
    }));
  }
}
