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
        fr: "Accueil",
        ar: "الرئيسية",
      },
      href: "/",
    },
    {
      label: {
        en: "About",
        es: "Acerca de",
        fr: "À propos",
        ar: "حول",
      },
      href: "/about",
    },
    {
      label: {
        en: "Projects",
        es: "Proyectos",
        fr: "Projets",
        ar: "المشاريع",
      },
      href: "/projects",
    },
    {
      label: {
        en: "Organizations",
        es: "Organizaciones",
        fr: "Organisations",
        ar: "المنظمات",
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
        fr: "Connexion",
        ar: "تسجيل الدخول",
      },
      href: "/login",
    },
    {
      label: {
        en: "Sign Up",
        es: "Registrarse",
        fr: "S'inscrire",
        ar: "التسجيل",
      },
      href: "/signup",
    },
    {
      label: {
        en: "Forgot Password",
        es: "Olvidé mi contraseña",
        fr: "Mot de passe oublié",
        ar: "نسيت كلمة المرور",
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
        fr: "Projets",
        ar: "المشاريع",
      },
      href: "/space/projects",
      icon: FolderKanban,
    },
    Team: {
      label: {
        en: "Team",
        es: "Equipo",
        fr: "Équipe",
        ar: "الفريق",
      },
      href: "/space/team",
      icon: Users,
    },
    Settings: {
      label: {
        en: "Settings",
        es: "Configuración",
        fr: "Paramètres",
        ar: "الإعدادات",
      },
      href: "/space/settings",
      icon: Settings,
    },
    Billing: {
      label: {
        en: "Billing",
        es: "Facturación",
        fr: "Facturation",
        ar: "الفواتير",
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
        fr: "Projets",
        ar: "المشاريع",
      },
      href: "/organizations/[slug]/projects",
      icon: FolderKanban,
    },
    Team: {
      label: {
        en: "Team",
        es: "Equipo",
        fr: "Équipe",
        ar: "الفريق",
      },
      href: "/organizations/[slug]/team",
      icon: Users,
    },
    Settings: {
      label: {
        en: "Settings",
        es: "Configuración",
        fr: "Paramètres",
        ar: "الإعدادات",
      },
      href: "/organizations/[slug]/settings",
      icon: Settings,
    },
    "Invoice History": {
      label: {
        en: "Invoice History",
        es: "Historial de facturas",
        fr: "Historique des factures",
        ar: "سجل الفواتير",
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
        fr: "Projets",
        ar: "المشاريع",
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
        fr: "Fils",
        ar: "المواضيع",
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
        fr: "Mes contributions",
        ar: "مساهماتي",
      },
      href: "/contributions",
      icon: GitPullRequest,
    },
    "My Threads": {
      label: {
        en: "My Threads",
        es: "Mis hilos",
        fr: "Mes fils",
        ar: "مواضيعي",
      },
      href: "/threads",
      icon: MessageSquare,
    },
    Profile: {
      label: {
        en: "Profile",
        es: "Perfil",
        fr: "Profil",
        ar: "الملف الشخصي",
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
  fr: string;
  ar: string;
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
