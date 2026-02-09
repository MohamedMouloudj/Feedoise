import {
  TrendingUp,
  ListChecks,
  Eye,
  Bell,
  MessageSquare,
  Languages,
} from "lucide-react";
/**
 * Static data for the About page, including feature descriptions in multiple languages.
 */
export const featureTranslations: Record<
  string,
  { id: string; title: string; description: string }[]
> = {
  en: [
    {
      id: "multilingual-feedback",
      title: "Multilingual Feedback",
      description:
        "Feedback is submitted in users' native languages and translated for project owners, with static UI translations handled at build time using the Lingo.dev SDK & Lingo.dev Compiler.",
    },
    {
      id: "priority-weighting",
      title: "Priority Weighting",
      description:
        "Owners assign priority weights to threads; dashboard ranks them by weighted score.",
    },
    {
      id: "light-ticketing",
      title: "Light Ticketing",
      description:
        "Status tracking, assignment to team members, labels/tags for organization.",
    },
    {
      id: "project-discovery",
      title: "Project Discovery",
      description:
        "Projects can be public or invite-only for complete control.",
    },
    {
      id: "follow-notifications",
      title: "Follow & Notifications",
      description:
        "Users follow projects, get in-app updates when their feedback gets replies, status changes, or priority updates.",
    },
    {
      id: "comment-threads",
      title: "Comment Threads",
      description:
        "Rich discussion on each feedback item with real-time updates and threaded conversations.",
    },
  ],
  es: [
    {
      id: "multilingual-feedback",
      title: "Comentarios multilingües",
      description:
        "Los comentarios se envían en el idioma nativo del usuario y se traducen para los propietarios del proyecto. Las traducciones estáticas de la interfaz se gestionan en tiempo de compilación con Lingo.dev SDK y Lingo.dev Compiler.",
    },
    {
      id: "priority-weighting",
      title: "Ponderación de prioridad",
      description:
        "Los propietarios asignan pesos de prioridad a los hilos; el panel los clasifica según una puntuación ponderada.",
    },
    {
      id: "light-ticketing",
      title: "Ticketing ligero",
      description:
        "Seguimiento de estado, asignación a miembros del equipo y etiquetas para la organización.",
    },
    {
      id: "project-discovery",
      title: "Descubrimiento de proyectos",
      description:
        "Los proyectos pueden ser públicos o solo por invitación para un control total.",
    },
    {
      id: "follow-notifications",
      title: "Seguimiento y notificaciones",
      description:
        "Los usuarios siguen proyectos y reciben actualizaciones en la aplicación cuando su comentario recibe respuestas, cambios de estado o de prioridad.",
    },
    {
      id: "comment-threads",
      title: "Hilos de comentarios",
      description:
        "Debate enriquecido en cada comentario con actualizaciones en tiempo real y conversaciones encadenadas.",
    },
  ],

  fr: [
    {
      id: "multilingual-feedback",
      title: "Feedback multilingue",
      description:
        "Les retours sont soumis dans la langue native des utilisateurs et traduits pour les propriétaires de projet. Les traductions statiques de l’interface sont gérées au moment du build via le SDK et le Compiler Lingo.dev.",
    },
    {
      id: "priority-weighting",
      title: "Pondération des priorités",
      description:
        "Les propriétaires attribuent des poids de priorité aux discussions ; le tableau de bord les classe par score pondéré.",
    },
    {
      id: "light-ticketing",
      title: "Ticketing léger",
      description:
        "Suivi des statuts, attribution aux membres de l’équipe et étiquettes pour l’organisation.",
    },
    {
      id: "project-discovery",
      title: "Découverte de projets",
      description:
        "Les projets peuvent être publics ou accessibles uniquement sur invitation pour un contrôle total.",
    },
    {
      id: "follow-notifications",
      title: "Suivi et notifications",
      description:
        "Les utilisateurs suivent les projets et reçoivent des notifications lorsqu’un retour reçoit des réponses, des changements de statut ou de priorité.",
    },
    {
      id: "comment-threads",
      title: "Fils de discussion",
      description:
        "Discussions riches pour chaque retour avec mises à jour en temps réel et conversations structurées.",
    },
  ],

  ar: [
    {
      id: "multilingual-feedback",
      title: "ملاحظات متعددة اللغات",
      description:
        "يتم إرسال الملاحظات بلغة المستخدم الأصلية وترجمتها لمالكي المشاريع. تتم إدارة ترجمات واجهة المستخدم الثابتة أثناء وقت البناء باستخدام Lingo.dev SDK و Lingo.dev Compiler.",
    },
    {
      id: "priority-weighting",
      title: "تحديد الأولويات",
      description:
        "يقوم المالكون بتعيين أوزان أولوية للمناقشات، ويتم ترتيبها في لوحة التحكم حسب النقاط المرجحة.",
    },
    {
      id: "light-ticketing",
      title: "نظام تذاكر خفيف",
      description:
        "تتبع الحالة، إسناد المهام لأعضاء الفريق، واستخدام الوسوم للتنظيم.",
    },
    {
      id: "project-discovery",
      title: "اكتشاف المشاريع",
      description:
        "يمكن جعل المشاريع عامة أو متاحة عبر دعوة فقط للتحكم الكامل.",
    },
    {
      id: "follow-notifications",
      title: "المتابعة والتنبيهات",
      description:
        "يمكن للمستخدمين متابعة المشاريع واستلام إشعارات داخل التطبيق عند الردود أو تغييرات الحالة أو الأولوية.",
    },
    {
      id: "comment-threads",
      title: "سلاسل التعليقات",
      description: "نقاشات غنية لكل ملاحظة مع تحديثات فورية ومحادثات مترابطة.",
    },
  ],
};

type Feature = (typeof featureTranslations)[string][number];

/**
 * Icons for each feature in About page, imported from the lucide-react library.
 */
export const featuresIcons: Record<Feature["id"], React.ElementType> = {
  "multilingual-feedback": Languages,
  "priority-weighting": TrendingUp,
  "light-ticketing": ListChecks,
  "project-discovery": Eye,
  "follow-notifications": Bell,
  "comment-threads": MessageSquare,
};

/**
 * Supported languages of features on Home page
 */
export const featureCards = {
  en: {
    multilingual: {
      title: "Multilingual Support",
      description:
        "Users submit feedback in their language, you read it in yours. Automatic translation powered by AI.",
    },
    prioritization: {
      title: "Smart Prioritization",
      description:
        "Weighted scoring system helps you focus on what matters most to your users.",
    },
    ticketing: {
      title: "Light Ticketing",
      description:
        "Track status, assign tasks, add labels. Everything you need without the complexity.",
    },
  },
  es: {
    multilingual: {
      title: "Soporte multilingüe",
      description:
        "Los usuarios envían comentarios en su idioma, tú los lees en el tuyo. Traducción automática impulsada por IA.",
    },
    prioritization: {
      title: "Priorización inteligente",
      description:
        "El sistema de puntuación ponderada te ayuda a centrarte en lo que más importa a tus usuarios.",
    },
    ticketing: {
      title: "Gestión de tickets ligera",
      description:
        "Sigue estados, asigna tareas, añade etiquetas. Todo lo que necesitas sin complicaciones.",
    },
  },
  fr: {
    multilingual: {
      title: "Support multilingue",
      description:
        "Les utilisateurs soumettent leurs commentaires dans leur langue, vous les lisez dans la vôtre. Traduction automatique par IA.",
    },
    prioritization: {
      title: "Priorisation intelligente",
      description:
        "Le système de notation pondérée vous aide à vous concentrer sur ce qui compte le plus pour vos utilisateurs.",
    },
    ticketing: {
      title: "Billetterie légère",
      description:
        "Suivez le statut, attribuez des tâches, ajoutez des étiquettes. Tout ce dont vous avez besoin sans la complexité.",
    },
  },
  ar: {
    multilingual: {
      title: "دعم لغات متعددة",
      description:
        "يرسل المستخدمون ملاحظاتهم بلغتهم، وتقرأها أنت بلغتك. ترجمة تلقائية مدعومة بالذكاء الاصطناعي.",
    },
    prioritization: {
      title: "تحديد أولويات ذكي",
      description:
        "نظام تسجيل مرجح يساعدك على التركيز على الأمور الأكثر أهمية لمستخدميك.",
    },
    ticketing: {
      title: "نظام تذاكر مبسط",
      description:
        "تتبع الحالة، وتعيين المهام، وإضافة الملصقات. كل ما تحتاجه دون تعقيد.",
    },
  },
};

/**
 * Supported languages for the application.
 */
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
];
