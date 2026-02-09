// config/navigation.ts
import React from "react";
import {
  FolderKanban,
  Users,
  Settings,
  CreditCard,
  Receipt,
  GitPullRequest,
  MessageSquare,
  UserCircle,
} from "lucide-react";

export const NAVIGATION = {
  /** Public navigation (unauthenticated users) */
  PUBLIC: [
    {
      label: {
        en: "Home",
        es: "Inicio",
        ru: "Главная",
        fr: "Accueil",
        ar: "الرئيسية",
        zh: "首页",
        hi: "होम",
        pt: "Início",
      },
      href: "/",
    },
    {
      label: {
        en: "About",
        es: "Acerca de",
        ru: "О нас",
        fr: "À propos",
        ar: "حول",
        zh: "关于",
        hi: "के बारे में",
        pt: "Sobre",
      },
      href: "/about",
    },
    {
      label: {
        en: "Projects",
        es: "Proyectos",
        ru: "Проекты",
        fr: "Projets",
        ar: "المشاريع",
        zh: "项目",
        hi: "परियोजनाएं",
        pt: "Projetos",
      },
      href: "/projects",
    },
    {
      label: {
        en: "Organizations",
        es: "Organizaciones",
        ru: "Организации",
        fr: "Organisations",
        ar: "المنظمات",
        zh: "组织",
        hi: "संगठन",
        pt: "Organizações",
      },
      href: "/organizations",
    },
  ],

  /**
   * Auth pages
   */
  AUTH: [
    {
      label: {
        en: "Login",
        es: "Iniciar sesión",
        ru: "Войти",
        fr: "Connexion",
        ar: "تسجيل الدخول",
        zh: "登录",
        hi: "लॉगिन",
        pt: "Entrar",
      },
      href: "/login",
    },
    {
      label: {
        en: "Sign Up",
        es: "Registrarse",
        ru: "Регистрация",
        fr: "S'inscrire",
        ar: "التسجيل",
        zh: "注册",
        hi: "साइन अप करें",
        pt: "Cadastrar",
      },
      href: "/signup",
    },
    {
      label: {
        en: "Forgot Password",
        es: "Olvidé mi contraseña",
        ru: "Забыли пароль",
        fr: "Mot de passe oublié",
        ar: "نسيت كلمة المرور",
        zh: "忘记密码",
        hi: "पासवर्ड भूल गए",
        pt: "Esqueci a senha",
      },
      href: "/forgot-password",
    },
  ],

  /**
   * User's owned organization (appears first in sidebar)
   */
  OWNED_ORG: {
    Projects: {
      label: {
        en: "Projects",
        es: "Proyectos",
        ru: "Проекты",
        fr: "Projets",
        ar: "المشاريع",
        zh: "项目",
        hi: "परियोजनाएं",
        pt: "Projetos",
      },
      href: "/space/projects",
      icon: FolderKanban,
    },
    Team: {
      label: {
        en: "Team",
        es: "Equipo",
        ru: "Команда",
        fr: "Équipe",
        ar: "الفريق",
        zh: "团队",
        hi: "टीम",
        pt: "Equipe",
      },
      href: "/space/team",
      icon: Users,
    },
    Settings: {
      label: {
        en: "Settings",
        es: "Configuración",
        ru: "Настройки",
        fr: "Paramètres",
        ar: "الإعدادات",
        zh: "设置",
        hi: "सेटिंग्स",
        pt: "Configurações",
      },
      href: "/space/settings",
      icon: Settings,
    },
    Billing: {
      label: {
        en: "Billing",
        es: "Facturación",
        ru: "Платежи",
        fr: "Facturation",
        ar: "الفواتير",
        zh: "账单",
        hi: "बिलिंग",
        pt: "Faturamento",
      },
      href: "/space/billing",
      icon: CreditCard,
    },
  },

  /**
   * Organizations where user is Admin (not owner)
   */
  ORG_ADMIN_ITEMS: {
    Projects: {
      label: {
        en: "Projects",
        es: "Proyectos",
        ru: "Проекты",
        fr: "Projets",
        ar: "المشاريع",
        zh: "项目",
        hi: "परियोजनाएं",
        pt: "Projetos",
      },
      href: "/organizations/[slug]/projects",
      icon: FolderKanban,
    },
    Team: {
      label: {
        en: "Team",
        es: "Equipo",
        ru: "Команда",
        fr: "Équipe",
        ar: "الفريق",
        zh: "团队",
        hi: "टीम",
        pt: "Equipe",
      },
      href: "/organizations/[slug]/team",
      icon: Users,
    },
    Settings: {
      label: {
        en: "Settings",
        es: "Configuración",
        ru: "Настройки",
        fr: "Paramètres",
        ar: "الإعدادات",
        zh: "设置",
        hi: "सेटिंग्स",
        pt: "Configurações",
      },
      href: "/organizations/[slug]/settings",
      icon: Settings,
    },
    "Invoice History": {
      label: {
        en: "Invoice History",
        es: "Historial de facturas",
        ru: "История счетов",
        fr: "Historique des factures",
        ar: "سجل الفواتير",
        zh: "发票历史",
        hi: "चालान इतिहास",
        pt: "Histórico de faturas",
      },
      href: "/organizations/[slug]/billing",
      icon: Receipt,
    },
  },

  /**
   * Organizations where user is Member (not owner/admin)
   */
  ORG_MEMBER_ITEMS: {
    Projects: {
      label: {
        en: "Projects",
        es: "Proyectos",
        ru: "Проекты",
        fr: "Projets",
        ar: "المشاريع",
        zh: "项目",
        hi: "परियोजनाएं",
        pt: "Projetos",
      },
      href: "/organizations/[slug]/projects",
      icon: FolderKanban,
    },
  },

  /**
   * Projects where user is Contributor/Maintainer (no org membership)
   */
  PROJECT_CONTRIBUTOR_ITEMS: {
    Threads: {
      label: {
        en: "Threads",
        es: "Hilos",
        ru: "Обсуждения",
        fr: "Fils",
        ar: "المواضيع",
        zh: "讨论串",
        hi: "थ्रेड्स",
        pt: "Tópicos",
      },
      href: "/projects/[slug]/threads",
      icon: MessageSquare,
    },
  },

  /**
   * Standard user activity links (always visible)
   */
  USER_ACTIVITY: {
    "My Contributions": {
      label: {
        en: "My Contributions",
        es: "Mis contribuciones",
        ru: "Мои вклады",
        fr: "Mes contributions",
        ar: "مساهماتي",
        zh: "我的贡献",
        hi: "मेरे योगदान",
        pt: "Minhas contribuições",
      },
      href: "/contributions",
      icon: GitPullRequest,
    },
    "My Threads": {
      label: {
        en: "My Threads",
        es: "Mis hilos",
        ru: "Мои обсуждения",
        fr: "Mes fils",
        ar: "مواضيعي",
        zh: "我的讨论串",
        hi: "मेरे थ्रेड्स",
        pt: "Meus tópicos",
      },
      href: "/threads",
      icon: MessageSquare,
    },
    Profile: {
      label: {
        en: "Profile",
        es: "Perfil",
        ru: "Профиль",
        fr: "Profil",
        ar: "الملف الشخصي",
        zh: "个人资料",
        hi: "प्रोफ़ाइल",
        pt: "Perfil",
      },
      href: "/profile",
      icon: UserCircle,
    },
  },
} as const;

export type NavigationLabels =
  | (typeof NAVIGATION.PUBLIC)[number]["label"]
  | (typeof NAVIGATION.AUTH)[number]["label"]
  | (typeof NAVIGATION.OWNED_ORG)[keyof typeof NAVIGATION.OWNED_ORG]["label"]
  | (typeof NAVIGATION.ORG_ADMIN_ITEMS)[keyof typeof NAVIGATION.ORG_ADMIN_ITEMS]["label"]
  | (typeof NAVIGATION.ORG_MEMBER_ITEMS)[keyof typeof NAVIGATION.ORG_MEMBER_ITEMS]["label"]
  | (typeof NAVIGATION.PROJECT_CONTRIBUTOR_ITEMS)[keyof typeof NAVIGATION.PROJECT_CONTRIBUTOR_ITEMS]["label"]
  | (typeof NAVIGATION.USER_ACTIVITY)[keyof typeof NAVIGATION.USER_ACTIVITY]["label"];

/**
 * Helper type for the label structure (multilingual)
 */
export type MultilingualLabel = {
  en: string;
  es: string;
  ru: string;
  fr: string;
  ar: string;
  zh: string;
  hi: string;
  pt: string;
};

/**
 * Specific language key type
 */
export type LanguageCode = keyof MultilingualLabel | string;

export type OrganizationRole = "owner" | "admin" | "member";
export type ProjectRole = "maintainer" | "contributor";

export type NavigationItem = {
  href: string;
  icon: React.ElementType;
};

export type NavigationSection = Record<string, NavigationItem>;

export interface SidebarOrgSection {
  id: string;
  name: string;
  slug: string;
  role: OrganizationRole;
  isOwned: boolean; // true if user is the org owner
}

export interface SidebarProjectSection {
  id: string;
  name: string;
  slug: string;
  organizationName: string;
  role: ProjectRole;
}

/**
 * Get navigation items for an organization based on user's role
 */
export function getOrgNavigationItems(
  role: OrganizationRole,
  isOwned: boolean,
) {
  if (isOwned) {
    // User owns this organization - show all items
    return NAVIGATION.OWNED_ORG;
  }

  if (role === "admin") {
    // User is admin in another org
    return NAVIGATION.ORG_ADMIN_ITEMS;
  }

  // User is just a member
  return NAVIGATION.ORG_MEMBER_ITEMS;
}

/**
 * Get navigation items for a project based on user's role
 */
export function getProjectNavigationItems(_role: ProjectRole) {
  // For now, both contributor and maintainer see the same items
  // In the future, maintainers might see additional management options
  return NAVIGATION.PROJECT_CONTRIBUTOR_ITEMS;
}

/**
 * Build dynamic route with slug parameter
 */
export function buildOrgRoute(template: string, slug: string): string {
  return template.replace("[slug]", slug);
}

export function buildProjectRoute(template: string, slug: string): string {
  return template.replace("[slug]", slug);
}
