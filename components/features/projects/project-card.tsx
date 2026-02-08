import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProjectWithOrganization } from "@/services/Projects";
import { Users, MessageSquare, Eye, EyeOff } from "lucide-react";

type ProjectCardProps = {
  project: ProjectWithOrganization;
  href: string;
};

export function ProjectCard({ project, href }: ProjectCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">
                {project.name}
              </h3>
              {project.isPublic ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              by {project.organization.name}
            </p>
          </div>
          <Badge variant={project.isPublic ? "default" : "secondary"}>
            {project.isPublic ? "Public" : "Private"}
          </Badge>
        </div>

        {project.description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project._count.members} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{project._count.threads} threads</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
