import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Users,
  CreditCard,
  GitPullRequest,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

async function getUserOrganizationRole(userId: string) {
  const orgMember = await prisma.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  return orgMember;
}

export default async function AppSidebar() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }

  const orgMembership = await getUserOrganizationRole(session.user.id);

  // User has no organization
  if (!orgMembership) {
    return (
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-background p-6">
        <div className="mb-8">
          <Logo responsive size="lg" />
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink href="/contributions" icon={GitPullRequest}>
            Contributions
          </NavLink>
          <NavLink href="/projects" icon={FolderKanban}>
            Projects
          </NavLink>
          <Separator className="my-4" />
          <NavLink href="/profile" icon={Settings}>
            Profile
          </NavLink>
        </nav>
      </aside>
    );
  }

  // User has organization - show org-specific navigation
  const isOwner = orgMembership.role === "owner";
  const isAdmin = orgMembership.role === "admin";

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-background p-6">
      <div className="mb-8">
        <Logo responsive size="lg" />
        <p className="mt-2 text-sm text-muted-foreground">
          {orgMembership.organization.name}
        </p>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink href="/dashboard" icon={LayoutDashboard}>
          Dashboard
        </NavLink>
        <NavLink href="/dashboard/projects" icon={FolderKanban}>
          Projects
        </NavLink>

        {(isOwner || isAdmin) && (
          <>
            <Separator className="my-4" />
            <NavLink href="/dashboard/settings" icon={Settings}>
              Organization Settings
            </NavLink>
            <NavLink href="/dashboard/team" icon={Users}>
              Team Management
            </NavLink>
          </>
        )}

        {isOwner && (
          <NavLink href="/dashboard/billing" icon={CreditCard}>
            Billing
          </NavLink>
        )}

        <Separator className="my-4" />
        <NavLink href="/profile" icon={Settings}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
