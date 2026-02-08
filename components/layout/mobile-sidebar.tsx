"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { gsap } from "gsap";
import AppButton from "../AppButton";
import { useLingoContext } from "@lingo.dev/compiler/react";
import { Badge } from "@/components/ui/badge";
import type { OrganizationRole, ProjectRole } from "@/config/navigation";
import {
  NAVIGATION,
  getOrgNavigationItems,
  getProjectNavigationItems,
  buildOrgRoute,
  buildProjectRoute,
} from "@/config/navigation";
import { MobileSidebarProps } from "@/types/navigation";

export function MobileSidebar({
  isAuthenticated,
  ownedOrg,
  memberOrgs,
  contributorProjects,
}: MobileSidebarProps) {
  const navigation = NAVIGATION;
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["owned-org", "user-activity"]),
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { locale } = useLingoContext();
  const isRTL = locale === "ar";

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  if (!isAuthenticated) return null;

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
        className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-64 bg-background border-${isRTL ? "l" : "r"} border-border z-50 p-4 lg:hidden transform ${isRTL ? "translate-x-full" : "-translate-x-full"} overflow-y-auto`}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="flex items-center justify-between mb-6">
          <Logo size="sm" />
          <AppButton
            type="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </AppButton>
        </div>

        <nav className="flex flex-col gap-1">
          {/* Owned Organization Section */}
          {ownedOrg && (
            <div className="mb-2">
              <button
                onClick={() => toggleSection("owned-org")}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span>{ownedOrg.name}</span>
                  <span className="text-xs text-muted-foreground">
                    My Organization
                  </span>
                </div>
                {isExpanded("owned-org") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isExpanded("owned-org") && (
                <div className="ml-3 mt-1 space-y-1">
                  {(
                    Object.entries(navigation.OWNED_ORG) as [
                      string,
                      { href: string; icon: React.ElementType },
                    ][]
                  ).map(([label, { href, icon: Icon }]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Organizations I'm In Section */}
          {memberOrgs.length > 0 && (
            <div className="mb-2">
              <button
                onClick={() => toggleSection("member-orgs")}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <span>Organizations I&apos;m In</span>
                {isExpanded("member-orgs") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isExpanded("member-orgs") && (
                <div className="ml-3 mt-1 space-y-2">
                  {memberOrgs.map((org) => {
                    const items = getOrgNavigationItems(
                      org.role as OrganizationRole,
                      false,
                    );
                    const sectionId = `org-${org.id}`;

                    return (
                      <div key={org.id}>
                        <button
                          onClick={() => toggleSection(sectionId)}
                          className="flex w-full items-center justify-between px-3 py-1.5 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span>{org.name}</span>
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {org.role}
                            </Badge>
                          </div>
                          {isExpanded(sectionId) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        {isExpanded(sectionId) && (
                          <div className="ml-3 mt-1 space-y-1">
                            {(
                              Object.entries(items) as [
                                string,
                                { href: string; icon: React.ElementType },
                              ][]
                            ).map(([label, { href, icon: Icon }]) => (
                              <Link
                                key={href}
                                href={buildOrgRoute(href, org.slug)}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                              >
                                <Icon className="h-4 w-4" />
                                {label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Projects I Contribute To Section */}
          {contributorProjects.length > 0 && (
            <div className="mb-2">
              <button
                onClick={() => toggleSection("contributor-projects")}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <span>Projects I Contribute To</span>
                {isExpanded("contributor-projects") ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isExpanded("contributor-projects") && (
                <div className="ml-3 mt-1 space-y-2">
                  {contributorProjects.map((project) => {
                    const items = getProjectNavigationItems(
                      project.role as ProjectRole,
                    );
                    const sectionId = `project-${project.id}`;

                    return (
                      <div key={project.id}>
                        <button
                          onClick={() => toggleSection(sectionId)}
                          className="flex w-full items-center justify-between px-3 py-1.5 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{project.name}</span>
                              <Badge
                                variant="secondary"
                                className="text-xs capitalize"
                              >
                                {project.role}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {project.organizationName}
                            </span>
                          </div>
                          {isExpanded(sectionId) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        {isExpanded(sectionId) && (
                          <div className="ml-3 mt-1 space-y-1">
                            {(
                              Object.entries(items) as [
                                string,
                                { href: string; icon: React.ElementType },
                              ][]
                            ).map(([label, { href, icon: Icon }]) => (
                              <Link
                                key={href}
                                href={buildProjectRoute(href, project.slug)}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                              >
                                <Icon className="h-4 w-4" />
                                {label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* User Activity Section */}
          <div className="mb-2 border-t pt-2">
            <button
              onClick={() => toggleSection("user-activity")}
              className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <span>My Activity</span>
              {isExpanded("user-activity") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {isExpanded("user-activity") && (
              <div className="ml-3 mt-1 space-y-1">
                {(
                  Object.entries(navigation.USER_ACTIVITY) as [
                    string,
                    { href: string; icon: React.ElementType },
                  ][]
                ).map(([label, { href, icon: Icon }]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
