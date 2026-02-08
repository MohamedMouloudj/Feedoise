import { getUserSession } from "@/actions/session-helper.action";
import { OrganizationsService } from "@/services/Organizations";
import { ProjectsService } from "@/services/Projects";
import { SidebarContent } from "./sidebar-content";

export default async function AppSidebar() {
  const session = await getUserSession();

  if (!session?.user) {
    return null;
  }

  // Fetch user's organizations and projects
  const [ownedOrg, memberOrgs, contributorProjects] = await Promise.all([
    OrganizationsService.getOwnedOrganization(session.user.id),
    OrganizationsService.getMemberOrganizations(session.user.id),
    ProjectsService.getUserContributorProjects(session.user.id),
  ]);

  // Transform data for sidebar
  const sidebarData = {
    ownedOrg: ownedOrg
      ? {
          id: ownedOrg.organization.id,
          name: ownedOrg.organization.name,
          slug: ownedOrg.organization.slug,
          role: ownedOrg.role,
        }
      : null,
    memberOrgs: memberOrgs.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      role: m.role,
    })),
    contributorProjects: contributorProjects.map((p) => ({
      id: p.project.id,
      name: p.project.name,
      slug: p.project.slug,
      organizationName: p.project.organization.name,
      role: p.role,
    })),
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-background">
      <SidebarContent
        ownedOrg={sidebarData.ownedOrg}
        memberOrgs={sidebarData.memberOrgs}
        contributorProjects={sidebarData.contributorProjects}
      />
    </aside>
  );
}
