"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  // Create a stable cache key from content values (not reference)
  const cacheKey = useMemo(() => {
    const values = Object.entries(content)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    return `${originalLanguage}-${targetLanguage}-${values}`;
  }, [content, originalLanguage, targetLanguage]);

  const [translationCache, setTranslationCache] = useState<
    Map<string, { [key: string]: string }>
  >(new Map());
  const [showOriginal, setShowOriginal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    let isMounted = true;

    translateContentAction(content, originalLanguage, targetLanguage)
      .then((result) => {
        if (isMounted && result.data) {
          setTranslationCache((prev) => {
            const next = new Map(prev);
            next.set(cacheKey, result.data);
            return next;
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Translation failed:", error);
        if (isMounted) {
          // Remove from requested set so it can be retried
          requestedRef.current.delete(cacheKey);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    cacheKey,
    shouldTranslate,
    content,
    originalLanguage,
    targetLanguage,
    translationCache,
  ]);

  const translatedContent = useMemo(() => {
    if (!shouldTranslate) {
      return content;
    }
    return translationCache.get(cacheKey) || content;
  }, [shouldTranslate, translationCache, cacheKey, content]);

  const isTranslating =
    shouldTranslate && isLoading && !translationCache.has(cacheKey);

  return {
    translatedContent,
    isTranslating,
    showOriginal,
    toggleOriginal: () => setShowOriginal((prev) => !prev),
    needsTranslation,
  };
}
