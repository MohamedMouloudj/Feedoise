"use client";
import { Badge } from "@/components/ui/badge";
import { ThreadStatus } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useLingoContext } from "@lingo.dev/compiler/react";

type StatusBadgeProps = {
  status: ThreadStatus;
  className?: string;
};

const statusConfig = {
  new: {
    label: {
      en: "New",
      es: "Nuevo",
      ru: "Новый",
      fr: "Nouveau",
      ar: "جديد",
      zh: "新",
      hi: "नया",
      pt: "Novo",
    },
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  },
  under_review: {
    label: {
      en: "Under Review",
      es: "En revisión",
      ru: "На рассмотрении",
      fr: "En cours d'examen",
      ar: "قيد المراجعة",
      zh: "审核中",
      hi: "समीक्षा के अधीन",
      pt: "Em revisão",
    },
    variant: "default" as const,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  planned: {
    label: {
      en: "Planned",
      es: "Planificado",
      ru: "Запланировано",
      fr: "Planifié",
      ar: "مخطط",
      zh: "已计划",
      hi: "नियोजित",
      pt: "Planejado",
    },
    variant: "default" as const,
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  },
  completed: {
    label: {
      en: "Completed",
      es: "Completado",
      ru: "Завершено",
      fr: "Terminé",
      ar: "مكتمل",
      zh: "已完成",
      hi: "पुरा हुआ",
      pt: "Concluído",
    },
    variant: "default" as const,
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  wont_fix: {
    label: {
      en: "Won't Fix",
      es: "No se solucionará",
      ru: "Не будет исправлено",
      fr: "Ne sera pas corrigé",
      ar: "لن يتم إصلاحه",
      zh: "不予修复",
      hi: "ठीक नहीं किया जाएगा",
      pt: "Não será corrigido",
    },
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
};

const selectStatusLabel = (status: ThreadStatus, locale: string) => {
  const config = statusConfig[status];
  return config.label[locale as keyof typeof config.label] || config.label.en;
};

/**
 * Component to display the status of a thread with appropriate styling and localization.
 * @param status - The current status of the thread (e.g., "new", "under_review", "planned", "completed", "wont_fix").
 * @param className - Optional additional class names for custom styling.
 * @returns
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const { locale } = useLingoContext();

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {selectStatusLabel(status, locale)}
    </Badge>
  );
}
