import { redirect } from "next/navigation";
import { OrganizationsService } from "@/services/Organizations";
import { ProjectsService } from "@/services/Projects";
import { ProjectCard } from "@/components/features/projects/project-card";
import AppButton from "@/components/AppButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getUserSession } from "@/actions/session-helper.action";

export default async function OrganizationProjectsPage() {
  const session = await getUserSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user's owned organization
  const ownedOrg = await OrganizationsService.getOwnedOrganization(
    session.user.id,
  );

  if (!ownedOrg) {
    redirect("/onboarding");
  }

  // Get all projects in the organization
  const projects = await ProjectsService.findByOrganization(
    ownedOrg.organization.id,
  );

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Manage feedback projects for {ownedOrg.organization.name}
          </p>
        </div>
        <Link href="/space/projects/new">
          <AppButton type="primary" icon={<Plus className="ml-2 h-4 w-4" />}>
            New Project
          </AppButton>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">No projects yet</h2>
          <p className="mb-6 text-muted-foreground">
            Create your first project to start collecting feedback
          </p>
          <Link href="/space/projects/new">
            <AppButton type="primary" icon={<Plus className="ml-2 h-4 w-4" />}>
              Create Project
            </AppButton>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              href={`/space/projects/${project.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
