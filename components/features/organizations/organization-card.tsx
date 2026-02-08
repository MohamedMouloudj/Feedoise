import Link from "next/link";
import Image from "next/image";
import { Organization } from "@/lib/generated/prisma/client";
import { Users, FolderKanban, Building2 } from "lucide-react";

type OrganizationCardProps = {
  organization: Organization & {
    _count: {
      members: number;
      projects: number;
    };
  };
  href: string;
};

export function OrganizationCard({
  organization,
  href,
}: OrganizationCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
            {organization.avatarUrl ? (
              <Image
                src={organization.avatarUrl}
                alt={organization.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary truncate">
              {organization.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{organization.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{organization._count.members} members</span>
          </div>
          <div className="flex items-center gap-1">
            <FolderKanban className="h-4 w-4" />
            <span>{organization._count.projects} projects</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
