"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Users,
  CreditCard,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { gsap } from "gsap";
import AppButton from "../AppButton";

interface MobileSidebarProps {
  isAuthenticated: boolean;
  organizationName?: string;
  role?: "owner" | "admin" | "member";
  isRTL?: boolean;
}

export function MobileSidebar({
  isAuthenticated,
  organizationName,
  role,
  isRTL = false,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
      });
      gsap.fromTo(
        sidebarRef.current,
        { x: isRTL ? "100%" : "-100%" },
        { x: 0, duration: 0.3, ease: "power2.out" },
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
      });
      gsap.to(sidebarRef.current, {
        x: isRTL ? "100%" : "-100%",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen, isRTL]);

  if (!isAuthenticated) return null;

  const isOwner = role === "owner";
  const isAdmin = role === "admin";
  const hasOrganization = !!organizationName;

  return (
    <>
      {/* Burger Button */}
      <AppButton
        type="ghost"
        size="icon"
        className="lg:hidden h-9 w-9"
        onClick={() => setIsOpen(true)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </AppButton>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 opacity-0 pointer-events-none lg:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-64 bg-background border-${isRTL ? "l" : "r"} border-border z-50 p-6 lg:hidden transform ${isRTL ? "translate-x-full" : "-translate-x-full"}`}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <Logo responsive size="sm" />
            {hasOrganization && (
              <p className="mt-2 text-sm text-muted-foreground">
                {organizationName}
              </p>
            )}
          </div>
          <AppButton
            type="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </AppButton>
        </div>

        <nav className="flex flex-col gap-2">
          {!hasOrganization ? (
            <>
              <NavLink href="/contributions" icon={FolderKanban}>
                Contributions
              </NavLink>
              <NavLink href="/projects" icon={LayoutDashboard}>
                Projects
              </NavLink>
              <Separator className="my-4" />
              <NavLink href="/profile" icon={Settings}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </aside>
    </>
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
