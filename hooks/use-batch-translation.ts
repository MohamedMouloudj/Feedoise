"use client";

import { useState, useEffect } from "react";
import { batchTranslateThreadsAction } from "@/actions/translation.action";

interface Thread {
  id: string;
  title: string;
  content?: string;
  originalLanguage: string;
}

export function useBatchTranslation(
  threads: Thread[],
  targetLocale: string,
  enabled = true,
) {
  const [translatedThreads, setTranslatedThreads] = useState<
    Array<{
      id: string;
      translatedTitle: string;
      translatedContent?: string;
    }>
  >(() =>
    threads.map((t) => ({
      id: t.id,
      translatedTitle: t.title,
      translatedContent: t.content,
    })),
  );
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!enabled || threads.length === 0) {
      return;
    }

    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) {
        setIsTranslating(true);
      }
      return batchTranslateThreadsAction(threads, targetLocale);
    })
      .then((result) => {
        if (isMounted && result.success) {
          setTranslatedThreads(result.data);
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedThreads(
            threads.map((t) => ({
              id: t.id,
              translatedTitle: t.title,
              translatedContent: t.content,
            })),
          );
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [threads, targetLocale, enabled]);

  return {
    translatedThreads,
    isTranslating,
  };
}
