import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationSheet } from "./notification-sheet";
import { MobileSidebar } from "./mobile-sidebar";
import { UserDropdown } from "./user-dropdown";
import AppButton from "../AppButton";
import { OrganizationsService } from "@/services/Organizations";
import { ProjectsService } from "@/services/Projects";
import { getUserSession } from "@/actions/session-helper.action";
import { NAVIGATION, NavigationLabels } from "@/config/navigation";
import { getLabel } from "@/lib/utils";

export default async function Navbar() {
  const session = await getUserSession();

  let sidebarData = null;

  if (session?.user) {
    const [ownedOrg, memberOrgs, contributorProjects] = await Promise.all([
      OrganizationsService.getOwnedOrganization(session.user.id),
      OrganizationsService.getMemberOrganizations(session.user.id),
      ProjectsService.getUserContributorProjects(session.user.id),
    ]);

    sidebarData = {
      ownedOrg: ownedOrg
        ? {
            id: ownedOrg.organization.id,
            name: ownedOrg.organization.name,
            slug: ownedOrg.organization.slug,
            role: "owner",
          }
        : null,
      memberOrgs: memberOrgs.map((org) => ({
        id: org.organization.id,
        name: org.organization.name,
        slug: org.organization.slug,
        role: org.role,
      })),
      contributorProjects: contributorProjects.map((pm) => ({
        id: pm.project.id,
        name: pm.project.name,
        slug: pm.project.slug,
        organizationName: pm.project.organization.name,
        role: pm.role,
      })),
    };
  }

  const navigation = NAVIGATION;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-4 md:gap-8">
          {session?.user ? (
            <MobileSidebar
              isAuthenticated={true}
              ownedOrg={sidebarData?.ownedOrg || null}
              memberOrgs={sidebarData?.memberOrgs || []}
              contributorProjects={sidebarData?.contributorProjects || []}
            />
          ) : null}
          <div className="max-sm:hidden">
            <Logo size="sm" href="/" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            {(
              Object.entries(navigation.OWNED_ORG) as [
                string,
                {
                  href: string;
                  icon: React.ElementType;
                  label: NavigationLabels;
                },
              ][]
            ).map(([_, { href, icon: Icon, label }]) => (
              <AppButton key={href} href={href} type="ghost" size="sm">
                {getLabel(label, session?.user.preferredLanguage || "en")}
              </AppButton>
            ))}
            {session?.user && (
              <AppButton type="ghost" size="sm" href="/space">
                Space
              </AppButton>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <NotificationSheet />
              <UserDropdown
                userName={session.user.name}
                userImage={session.user.image}
                userEmail={session.user.email}
                organizationName={sidebarData?.ownedOrg?.name}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AppButton type="outline" size="sm" href="/login">
                Log In
              </AppButton>
              <AppButton type="primary" size="sm" href="/signup">
                Sign Up
              </AppButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
