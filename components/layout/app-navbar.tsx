import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationSheet } from "./notification-sheet";
import { MobileSidebar } from "./mobile-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import AppButton from "../AppButton";

async function getUserOrganizationRole(userId: string) {
  const orgMember = await prisma.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  return orgMember;
}

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  let orgMembership = null;
  if (session?.user) {
    orgMembership = await getUserOrganizationRole(session.user.id);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-4 md:gap-8">
          {session?.user && (
            <MobileSidebar
              isAuthenticated={true}
              organizationName={orgMembership?.organization?.name}
              role={orgMembership?.role}
            />
          )}
          <Logo size="sm" href="/" />
          <div className="hidden md:flex items-center gap-4">
            <AppButton type="ghost" size="sm" href="/about">
              About
            </AppButton>
            <AppButton type="ghost" size="sm" href="/projects">
              Projects
            </AppButton>
            <AppButton type="ghost" size="sm" href="/organizations">
              Organizations
            </AppButton>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          {session?.user ? (
            <NotificationSheet />
          ) : (
            <div className="flex items-center gap-2">
              <AppButton type="outline" size="sm" href="/login">
                Log In
              </AppButton>
              <AppButton size="sm" href="/signup">
                Sign Up
              </AppButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
