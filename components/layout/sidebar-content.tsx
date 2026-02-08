"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OrganizationRole, ProjectRole } from "@/config/navigation";
import {
  NAVIGATION,
  getOrgNavigationItems,
  getProjectNavigationItems,
  buildOrgRoute,
  buildProjectRoute,
} from "@/config/navigation";
import { SidebarContentProps } from "@/types/navigation";

export function SidebarContent({
  ownedOrg,
  memberOrgs,
  contributorProjects,
}: SidebarContentProps) {
  const navigation = NAVIGATION;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["owned-org", "user-activity"]),
  );

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

  return (
    <nav className="flex flex-col gap-1 p-4">
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

      {/* User Activity Section (Always visible) */}
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
  );
}
