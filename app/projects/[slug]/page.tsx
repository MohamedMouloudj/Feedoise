import { notFound } from "next/navigation";
import { ProjectsService } from "@/services/Projects";
import { ThreadsService } from "@/services/Threads";
import { ThreadList } from "@/components/features/threads/thread-list";
import { CreateThreadDialog } from "@/components/features/threads/create-thread-dialog";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Eye } from "lucide-react";
import { getUserSession } from "@/actions/session-helper.action";

type PublicProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicProjectPage({
  params,
}: PublicProjectPageProps) {
  const { slug } = await params;

  // Find public project by slug
  const project = await ProjectsService.findByGlobalSlug(slug);

  if (!project || !project.isPublic) {
    notFound();
  }

  // Get threads for this project
  const threads = await ThreadsService.findByProject(project.id);

  const session = await getUserSession();

  return (
    <div className="container max-w-full p-8">
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              by {project.organization.name}
            </p>
          </div>
          <Badge variant="default">Public</Badge>
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

      <ThreadList
        threads={threads}
        projectSlug={slug}
        userLanguage={session?.user?.preferredLanguage || "en"}
      />
    </div>
  );
}
