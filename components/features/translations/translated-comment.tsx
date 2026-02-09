"use client";

import { useTranslation } from "@/hooks/use-translation";

interface TranslatedCommentProps {
  comment: {
    id: string;
    content: string;
    originalLanguage: string;
  };
  userLanguage: string;
  children: (data: {
    content: string;
    isTranslating: boolean;
    showOriginal: boolean;
    toggleOriginal: () => void;
    needsTranslation: boolean;
  }) => React.ReactNode;
}

export function TranslatedComment({
  comment,
  userLanguage,
  children,
}: TranslatedCommentProps) {
  const {
    translatedContent,
    isTranslating,
    showOriginal,
    toggleOriginal,
    needsTranslation,
  } = useTranslation({
    content: {
      content: comment.content,
    },
    originalLanguage: comment.originalLanguage,
    targetLanguage: userLanguage,
  });

  return (
    <>
      {children({
        content: translatedContent.content,
        isTranslating,
        showOriginal,
        toggleOriginal,
        needsTranslation,
      })}
    </>
  );
}
