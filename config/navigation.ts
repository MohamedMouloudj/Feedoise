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
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Organizations", href: "/organizations" },
  ],

  /**
   * Auth pages
   */
  AUTH: [
    { label: "Login", href: "/login" },
    { label: "Sign Up", href: "/signup" },
    { label: "Forgot Password", href: "/forgot-password" },
  ],

  /**
   * User's owned organization (appears first in sidebar)
   */
  OWNED_ORG: {
    Projects: { href: "/space/projects", icon: FolderKanban },
    Team: { href: "/space/team", icon: Users },
    Settings: { href: "/space/settings", icon: Settings },
    Billing: { href: "/space/billing", icon: CreditCard },
  },

  /**
   * Organizations where user is Admin (not owner)
   */
  ORG_ADMIN_ITEMS: {
    Projects: { href: "/organizations/[slug]/projects", icon: FolderKanban },
    Team: { href: "/organizations/[slug]/team", icon: Users },
    Settings: { href: "/organizations/[slug]/settings", icon: Settings },
    "Invoice History": { href: "/organizations/[slug]/billing", icon: Receipt },
  },

  /**
   * Organizations where user is Member (not owner/admin)
   */
  ORG_MEMBER_ITEMS: {
    Projects: { href: "/organizations/[slug]/projects", icon: FolderKanban },
  },

  /**
   * Projects where user is Contributor/Maintainer (no org membership)
   */
  PROJECT_CONTRIBUTOR_ITEMS: {
    Threads: { href: "/projects/[slug]/threads", icon: MessageSquare },
    // Maintainers might see additional options in the future
  },

  /**
   * Standard user activity links (always visible)
   */
  USER_ACTIVITY: {
    "My Contributions": { href: "/contributions", icon: GitPullRequest },
    "My Threads": { href: "/threads", icon: MessageSquare },
    Profile: { href: "/profile", icon: UserCircle },
  },
} as const;

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
