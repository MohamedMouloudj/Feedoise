import { ProjectsService } from "@/services/Projects";
import { ProjectCard } from "@/components/features/projects/project-card";
import { Search } from "lucide-react";

export default async function DiscoverProjectsPage() {
  const projects = await ProjectsService.findAllPublic();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover Projects</h1>
        <p className="mt-2 text-muted-foreground">
          Explore public feedback projects and share your thoughts
        </p>
      </div>

      {/* TODO: Add search/filter functionality in future */}
      {/* <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
      </div> */}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No public projects</h2>
          <p className="text-muted-foreground">
            Check back later for new projects to explore
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              href={`/projects/${project.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
