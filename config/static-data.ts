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

  ru: [
    {
      id: "multilingual-feedback",
      title: "Многоязычная обратная связь",
      description:
        "Отзывы отправляются на родном языке пользователей и переводятся для владельцев проектов. Статические переводы интерфейса выполняются на этапе сборки с помощью Lingo.dev SDK и Lingo.dev Compiler.",
    },
    {
      id: "priority-weighting",
      title: "Приоритизация",
      description:
        "Владельцы назначают вес приоритета обсуждениям; панель сортирует их по взвешенному рейтингу.",
    },
    {
      id: "light-ticketing",
      title: "Лёгкий тикетинг",
      description:
        "Отслеживание статуса, назначение участникам команды и метки для организации.",
    },
    {
      id: "project-discovery",
      title: "Обзор проектов",
      description:
        "Проекты могут быть публичными или доступными только по приглашению для полного контроля.",
    },
    {
      id: "follow-notifications",
      title: "Подписки и уведомления",
      description:
        "Пользователи подписываются на проекты и получают уведомления при ответах, изменениях статуса или приоритета.",
    },
    {
      id: "comment-threads",
      title: "Цепочки комментариев",
      description:
        "Полноценные обсуждения для каждого отзыва с обновлениями в реальном времени и вложенными комментариями.",
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

  zh: [
    {
      id: "multilingual-feedback",
      title: "多语言反馈",
      description:
        "反馈以用户的母语提交，并为项目所有者自动翻译。界面的静态翻译在构建阶段通过 Lingo.dev SDK 和 Lingo.dev Compiler 处理。",
    },
    {
      id: "priority-weighting",
      title: "优先级权重",
      description:
        "项目所有者为讨论分配优先级权重，仪表盘根据加权评分进行排序。",
    },
    {
      id: "light-ticketing",
      title: "轻量工单系统",
      description: "状态跟踪、成员分配以及用于组织管理的标签。",
    },
    {
      id: "project-discovery",
      title: "项目发现",
      description: "项目可以设为公开或仅限邀请，以实现完全控制。",
    },
    {
      id: "follow-notifications",
      title: "关注与通知",
      description:
        "用户可关注项目，并在反馈收到回复、状态或优先级变更时获得应用内通知。",
    },
    {
      id: "comment-threads",
      title: "评论线程",
      description: "每条反馈都支持实时更新的丰富讨论和分层评论。",
    },
  ],

  hi: [
    {
      id: "multilingual-feedback",
      title: "बहुभाषी प्रतिक्रिया",
      description:
        "प्रतिक्रिया उपयोगकर्ताओं की मूल भाषा में सबमिट की जाती है और प्रोजेक्ट मालिकों के लिए अनुवादित की जाती है। स्थिर UI अनुवाद बिल्ड समय पर Lingo.dev SDK और Lingo.dev Compiler के माध्यम से संभाले जाते हैं।",
    },
    {
      id: "priority-weighting",
      title: "प्राथमिकता निर्धारण",
      description:
        "मालिक थ्रेड्स को प्राथमिकता वज़न देते हैं; डैशबोर्ड उन्हें वेटेड स्कोर के अनुसार रैंक करता है।",
    },
    {
      id: "light-ticketing",
      title: "हल्का टिकटिंग",
      description:
        "स्थिति ट्रैकिंग, टीम सदस्यों को असाइन करना और संगठन के लिए लेबल।",
    },
    {
      id: "project-discovery",
      title: "प्रोजेक्ट खोज",
      description:
        "पूर्ण नियंत्रण के लिए प्रोजेक्ट सार्वजनिक या केवल आमंत्रण-आधारित हो सकते हैं।",
    },
    {
      id: "follow-notifications",
      title: "फ़ॉलो और सूचनाएँ",
      description:
        "उपयोगकर्ता प्रोजेक्ट्स को फ़ॉलो करते हैं और प्रतिक्रिया पर उत्तर, स्थिति या प्राथमिकता बदलने पर इन-ऐप सूचनाएँ प्राप्त करते हैं।",
    },
    {
      id: "comment-threads",
      title: "टिप्पणी थ्रेड्स",
      description:
        "प्रत्येक प्रतिक्रिया पर रीयल-टाइम अपडेट और थ्रेडेड चर्चाएँ।",
    },
  ],

  pt: [
    {
      id: "multilingual-feedback",
      title: "Feedback multilíngue",
      description:
        "O feedback é enviado no idioma nativo dos usuários e traduzido para os donos do projeto. As traduções estáticas da interface são tratadas no build usando o SDK e o Compiler da Lingo.dev.",
    },
    {
      id: "priority-weighting",
      title: "Peso de prioridade",
      description:
        "Os proprietários atribuem pesos de prioridade às threads; o painel as classifica por pontuação ponderada.",
    },
    {
      id: "light-ticketing",
      title: "Ticketing leve",
      description:
        "Acompanhamento de status, atribuição a membros da equipe e uso de etiquetas.",
    },
    {
      id: "project-discovery",
      title: "Descoberta de projetos",
      description:
        "Os projetos podem ser públicos ou apenas por convite para controle total.",
    },
    {
      id: "follow-notifications",
      title: "Seguir e notificações",
      description:
        "Usuários seguem projetos e recebem notificações no app quando há respostas, mudanças de status ou de prioridade.",
    },
    {
      id: "comment-threads",
      title: "Threads de comentários",
      description:
        "Discussões ricas para cada feedback com atualizações em tempo real e conversas encadeadas.",
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
  ru: {
    multilingual: {
      title: "Многоязычная поддержка",
      description:
        "Пользователи оставляют отзывы на своем языке, а вы читаете их на своем. Автоматический перевод на базе ИИ.",
    },
    prioritization: {
      title: "Умная приоритезация",
      description:
        "Система взвешенной оценки поможет вам сосредоточиться на том, что важнее всего для ваших пользователей.",
    },
    ticketing: {
      title: "Упрощенные тикеты",
      description:
        "Отслеживайте статус, назначайте задачи, добавляйте теги. Все необходимое без лишней сложности.",
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
  zh: {
    multilingual: {
      title: "多语言支持",
      description:
        "用户用他们的语言提交反馈，您用您的语言阅读。由人工智能驱动的自动翻译。",
    },
    prioritization: {
      title: "智能优先级排序",
      description: "加权评分系统帮助您专注于对用户最重要的事务。",
    },
    ticketing: {
      title: "轻量级工单",
      description: "跟踪状态、分配任务、添加标签。满足您的一切需求，化繁为简。",
    },
  },
  hi: {
    multilingual: {
      title: "बहुभाषी सहायता",
      description:
        "उपयोगकर्ता अपनी भाषा में फीडबैक सबमिट करते हैं, आप इसे अपनी भाषा में पढ़ते हैं। AI द्वारा संचालित स्वचालित अनुवाद।",
    },
    prioritization: {
      title: "स्मार्ट प्राथमिकता",
      description:
        "वेटेड स्कोरिंग सिस्टम आपको यह ध्यान केंद्रित करने में मदद करता है कि आपके उपयोगकर्ताओं के लिए सबसे अधिक क्या मायने रखता है।",
    },
    ticketing: {
      title: "लाइट टिकटिंग",
      description:
        "स्टेटस ट्रैक करें, टास्क असाइन करें, लेबल जोड़ें। वह सब कुछ जो आपको चाहिए, बिना किसी जटिलता के।",
    },
  },
  pt: {
    multilingual: {
      title: "Suporte multilíngue",
      description:
        "Os usuários enviam feedback no idioma deles, você lê no seu. Tradução automática via IA.",
    },
    prioritization: {
      title: "Priorização inteligente",
      description:
        "O sistema de pontuação ponderada ajuda você a focar no que é mais importante para seus usuários.",
    },
    ticketing: {
      title: "Gestão de tickets leve",
      description:
        "Acompanhe status, atribua tarefas e adicione etiquetas. Tudo o que você precisa sem complexidade.",
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
  { value: "zh", label: "中文" },
  { value: "ru", label: "Русский" },
  { value: "hi", label: "हिन्दी" },
  { value: "pt", label: "Português" },
];
