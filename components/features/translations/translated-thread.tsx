"use client";

import { useTranslation } from "@/hooks/use-translation";

interface TranslatedThreadProps {
  thread: {
    id: string;
    title: string;
    content: string;
    originalLanguage: string;
  };
  userLanguage: string;
  children: (data: {
    title: string;
    content: string;
    isTranslating: boolean;
    showOriginal: boolean;
    toggleOriginal: () => void;
    needsTranslation: boolean;
  }) => React.ReactNode;
}

export function TranslatedThread({
  thread,
  userLanguage,
  children,
}: TranslatedThreadProps) {
  const {
    translatedContent,
    isTranslating,
    showOriginal,
    toggleOriginal,
    needsTranslation,
  } = useTranslation({
    content: {
      title: thread.title,
      content: thread.content,
    },
    originalLanguage: thread.originalLanguage,
    targetLanguage: userLanguage,
  });

  return (
    <>
      {children({
        title: translatedContent.title,
        content: translatedContent.content,
        isTranslating,
        showOriginal,
        toggleOriginal,
        needsTranslation,
      })}
    </>
  );
}
