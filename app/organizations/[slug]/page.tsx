import { notFound } from "next/navigation";
import Image from "next/image";
import { OrganizationsService } from "@/services/Organizations";
import { ProjectCard } from "@/components/features/projects/project-card";
import { Building2, Users, FolderKanban, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AppButton from "@/components/AppButton";

type OrganizationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrganizationDetailPage({
  params,
}: OrganizationDetailPageProps) {
  const { slug } = await params;

  const organization = await OrganizationsService.findBySlug(slug);

  if (!organization) {
    notFound();
  }

  const publicProjects = await OrganizationsService.getPublicProjects(
    organization.id,
  );

  // Check if user is a member of this organization
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let isMember = false;
  if (session?.user) {
    const role = await OrganizationsService.getUserRoleInOrganization(
      session.user.id,
      organization.id,
    );
    isMember = role !== null;
  }

  return (
    <div className="container max-w-full p-8">
      {/* Organization Header */}
      <div className="mb-8 rounded-lg border border-border bg-card p-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
            {organization.avatarUrl ? (
              <Image
                src={organization.avatarUrl}
                alt={organization.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">{organization.name}</h1>
            <p className="mb-4 text-muted-foreground">@{organization.slug}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{organization._count.members} members</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                <span>{organization._count.projects} projects</span>
              </div>
            </div>

            {isMember && (
              <div className="mt-4">
                <AppButton
                  href={`/space/projects?org=${organization.id}`}
                  type="primary"
                  icon={<ArrowRight />}
                  dir="rtl"
                >
                  Go to Dashboard
                </AppButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Public Projects Section */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold">
          Public Projects ({publicProjects.length})
        </h2>

        {publicProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No public projects</h3>
            <p className="text-muted-foreground">
              This organization hasn&apos;t created any public projects yet
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                href={`/projects/${project.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
