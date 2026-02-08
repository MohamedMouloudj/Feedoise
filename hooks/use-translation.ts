"use client";

import { useState, useEffect, useMemo } from "react";
import { translateContent } from "@/lib/lingo";

interface UseTranslationOptions {
  content: { [key: string]: string };
  sourceLocale: string;
  targetLocale: string;
  enabled?: boolean;
}

export function useTranslation({
  content,
  sourceLocale,
  targetLocale,
  enabled = true,
}: UseTranslationOptions) {
  const [showOriginal, setShowOriginal] = useState(false);
  const needsTranslation = sourceLocale !== targetLocale;
  const shouldTranslate = enabled && !showOriginal && needsTranslation;

  const [translatedContent, setTranslatedContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);

  // Create a stable key for content changes
  const contentKey = useMemo(
    () => JSON.stringify(content),
    [content]
  );

  useEffect(() => {
    if (!shouldTranslate) {
      setTranslatedContent(content);
      setIsTranslating(false);
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    translateContent(content, sourceLocale, targetLocale)
      .then((translated) => {
        if (isMounted) {
          setTranslatedContent(translated);
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedContent(content);
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey, sourceLocale, targetLocale, shouldTranslate]);

  return {
    translatedContent,
    isTranslating,
    showOriginal,
    toggleOriginal: () => setShowOriginal((prev) => !prev),
    needsTranslation,
  };
}
