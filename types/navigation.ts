interface SidebarOrgData {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface SidebarProjectData {
  id: string;
  name: string;
  slug: string;
  organizationName: string;
  role: string;
}

interface SidebarContentProps {
  ownedOrg: SidebarOrgData | null;
  memberOrgs: SidebarOrgData[];
  contributorProjects: SidebarProjectData[];
}

interface MobileSidebarProps {
  isAuthenticated: boolean;
  ownedOrg: SidebarOrgData | null;
  memberOrgs: SidebarOrgData[];
  contributorProjects: SidebarProjectData[];
}

export type { SidebarContentProps, MobileSidebarProps };
