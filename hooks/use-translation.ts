"use client";

import { useEffect, useRef, useMemo, useTransition, useState } from "react";
import { translateContentAction } from "@/actions/translation.action";

interface UseTranslationOptions {
  content: { [key: string]: string };
  originalLanguage: string;
  targetLanguage: string;
  enabled?: boolean;
}

export function useTranslation({
  content,
  originalLanguage,
  targetLanguage,
  enabled = true,
}: UseTranslationOptions) {
  const [isPending, startTransition] = useTransition();

  // Create a stable cache key from content values (not reference)
  const cacheKey = useMemo(() => {
    const values = Object.entries(content)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    return `${originalLanguage}-${targetLanguage}-${values}`;
  }, [content, originalLanguage, targetLanguage]);

  const [translationCache, setTranslationCache] = useState<
    Map<string, { [key: string]: string }>
  >(new Map());
  const [showOriginal, setShowOriginal] = useState(false);
  const requestedRef = useRef<Set<string>>(new Set());

  const needsTranslation = originalLanguage !== targetLanguage;
  const shouldTranslate = enabled && !showOriginal && needsTranslation;

  useEffect(() => {
    // Don't translate if not needed or already requested
    if (!shouldTranslate || requestedRef.current.has(cacheKey)) {
      return;
    }

    if (translationCache.has(cacheKey)) {
      return;
    }

    // Mark as requested to prevent duplicate requests
    requestedRef.current.add(cacheKey);

    let isMounted = true;

    startTransition(async () => {
      try {
        const result = await translateContentAction(
          content,
          originalLanguage,
          targetLanguage,
        );

        if (isMounted && result.data) {
          setTranslationCache((prev) => {
            const newCache = new Map(prev);
            newCache.set(cacheKey, result.data);
            return newCache;
          });
        }
      } catch (error) {
        console.error("Translation failed:", error);
        if (isMounted) {
          // Remove from requested set so it can be retried
          requestedRef.current.delete(cacheKey);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [cacheKey, shouldTranslate, content, originalLanguage, targetLanguage]);

  const translatedContent = useMemo(() => {
    if (!shouldTranslate) {
      return content;
    }
    return translationCache.get(cacheKey) || content;
  }, [shouldTranslate, cacheKey, content, translationCache]);

  const isTranslating =
    shouldTranslate && isPending && !translationCache.has(cacheKey);

  return {
    translatedContent,
    isTranslating,
    showOriginal,
    toggleOriginal: () => setShowOriginal((prev) => !prev),
    needsTranslation,
  };
}
