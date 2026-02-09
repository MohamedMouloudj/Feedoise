"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  // Create stable cache key from thread IDs and locale
  const cacheKey = useMemo(() => {
    const threadIds = threads.map((t) => t.id).sort().join(",");
    return `${threadIds}-${targetLocale}`;
  }, [threads, targetLocale]);

  const [translationCache, setTranslationCache] = useState<
    Map<
      string,
      Array<{
        id: string;
        translatedTitle: string;
        translatedContent?: string;
      }>
    >
  >(new Map());
  
  const [isTranslating, setIsTranslating] = useState(false);
  const requestedRef = useRef<Set<string>>(new Set());

  // Check if any thread needs translation
  const needsTranslation = useMemo(
    () => threads.some((t) => t.originalLanguage !== targetLocale),
    [threads, targetLocale],
  );

  useEffect(() => {
    if (!enabled || threads.length === 0 || !needsTranslation) {
      return;
    }

    // Check if already requested or in cache
    if (requestedRef.current.has(cacheKey) || translationCache.has(cacheKey)) {
      return;
    }

    // Mark as requested
    requestedRef.current.add(cacheKey);
    setIsTranslating(true);

    let isMounted = true;

    batchTranslateThreadsAction(threads, targetLocale)
      .then((result) => {
        if (isMounted && result.success) {
          setTranslationCache((prev) => {
            const next = new Map(prev);
            next.set(cacheKey, result.data);
            return next;
          });
          setIsTranslating(false);
        }
      })
      .catch((error) => {
        console.error("Batch translation failed:", error);
        if (isMounted) {
          // Remove from requested set so it can be retried
          requestedRef.current.delete(cacheKey);
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cacheKey, enabled, threads, targetLocale, needsTranslation, translationCache]);

  const translatedThreads = useMemo(() => {
    if (!needsTranslation) {
      return threads.map((t) => ({
        id: t.id,
        translatedTitle: t.title,
        translatedContent: t.content,
      }));
    }

    return (
      translationCache.get(cacheKey) ||
      threads.map((t) => ({
        id: t.id,
        translatedTitle: t.title,
        translatedContent: t.content,
      }))
    );
  }, [threads, targetLocale, translationCache, cacheKey, needsTranslation]);

  return {
    translatedThreads,
    isTranslating: isTranslating && !translationCache.has(cacheKey),
  };
}
