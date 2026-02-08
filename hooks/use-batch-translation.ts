"use client";

import { useState, useEffect, useMemo } from "react";
import { batchTranslateThreads } from "@/lib/lingo";

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
  const shouldTranslate = enabled && threads.length > 0;
  const [translatedThreads, setTranslatedThreads] = useState(threads);
  const [isTranslating, setIsTranslating] = useState(false);

  // Create a stable key for threads changes
  const threadsKey = useMemo(
    () => threads.map((t) => t.id).join(","),
    [threads]
  );

  useEffect(() => {
    if (!shouldTranslate) {
      setTranslatedThreads(threads);
      setIsTranslating(false);
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    batchTranslateThreads(threads, targetLocale)
      .then((translated) => {
        if (isMounted) {
          setTranslatedThreads(translated as Thread[]);
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedThreads(threads);
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadsKey, targetLocale, shouldTranslate]);

  return {
    translatedThreads,
    isTranslating,
  };
}
