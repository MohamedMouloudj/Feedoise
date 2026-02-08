import { notFound } from "next/navigation";
import { ProjectsService } from "@/services/Projects";
import { ThreadsService } from "@/services/Threads";
import { OrganizationsService } from "@/services/Organizations";

import { ThreadList } from "@/components/features/threads/thread-list";
import { CreateThreadDialog } from "@/components/features/threads/create-thread-dialog";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Eye, EyeOff } from "lucide-react";
import { getUserSession } from "@/actions/session-helper.action";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // Try to find project for the user's owned organization first
  const session = await getUserSession();

  let project = null;

  if (session?.user) {
    const ownedOrg = await OrganizationsService.getOwnedOrganization(
      session.user.id,
    );
    if (ownedOrg) {
      project = await ProjectsService.findBySlug(
        ownedOrg.organization.id,
        slug,
      );
    }
  }

  if (!project) {
    notFound();
  }

  // Get threads for this project
  const threads = await ThreadsService.findByProject(project.id);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              {project.isPublic ? (
                <Eye className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground">
              by {project.organization.name}
            </p>
          </div>
          <Badge variant={project.isPublic ? "default" : "secondary"}>
            {project.isPublic ? "Public" : "Private"}
          </Badge>
        </div>

        {project.description && (
          <p className="mb-6 text-muted-foreground">{project.description}</p>
        )}

        <div className="mb-6 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{project._count.members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{project._count.threads} threads</span>
          </div>
        </div>

        {session?.user && (
          <div className="flex justify-end">
            <CreateThreadDialog projectId={project.id} />
          </div>
        )}
      </div>

      <ThreadList threads={threads} projectSlug={slug} />
    </div>
  );
}
