"use client";

import { useState, useEffect } from "react";
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
  const [translatedCache, setTranslatedCache] = useState<{
    [key: string]: string;
  } | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const needsTranslation = originalLanguage !== targetLanguage;
  const shouldTranslate = enabled && !showOriginal && needsTranslation;

  useEffect(() => {
    if (!shouldTranslate) {
      return;
    }

    let isMounted = true;

    translateContentAction(content, originalLanguage, targetLanguage)
      .then((result) => {
        if (isMounted) {
          setTranslatedCache(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedCache(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [content, originalLanguage, targetLanguage, shouldTranslate]);

  const isTranslating = shouldTranslate && translatedCache === null;
  const translatedContent =
    shouldTranslate && translatedCache ? translatedCache : content;

  return {
    translatedContent,
    isTranslating,
    showOriginal,
    toggleOriginal: () => setShowOriginal((prev) => !prev),
    needsTranslation,
  };
}
