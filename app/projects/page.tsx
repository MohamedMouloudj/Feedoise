"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectCard } from "@/components/features/projects/project-card";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce } from "@/lib/debounce";
import { ProjectWithOrganization } from "@/services/Projects";
import { Skeleton } from "@/components/ui/skeleton";
import { TAKE } from "@/config/const";

export default function DiscoverProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithOrganization[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [skip, setSkip] = useState(0);

  const fetchProjects = async (
    searchTerm: string,
    skipValue: number,
    isNewSearch = false,
  ) => {
    try {
      const response = await fetch(
        `/api/projects/public?skip=${skipValue}&take=${TAKE}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`,
      );
      const data = await response.json();

      if (isNewSearch) {
        setProjects(data.items);
      } else {
        setProjects((prev) => [...prev, ...data.items]);
      }
      setHasMore(data.hasMore);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProjects("", 0, true);
  }, []);

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setIsLoading(true);
      setSkip(0);
      fetchProjects(searchTerm, 0, true);
    }, 300),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const loadMore = () => {
    const newSkip = skip + TAKE;
    setSkip(newSkip);
    fetchProjects(searchQuery, newSkip, false);
  };

  return (
    <div className="container max-w-full p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover Projects</h1>
        <p className="mt-2 text-muted-foreground">
          Explore public feedback projects and share your thoughts
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects by name, description, or organization..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoading && projects.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <InfiniteScrollList
          items={projects}
          hasMore={hasMore}
          loadMore={loadMore}
          renderItem={(project) => (
            <ProjectCard
              key={project.id}
              project={project}
              href={`/projects/${project.slug}`}
            />
          )}
          emptyMessage="No projects found. Try a different search term."
        />
      )}
    </div>
  );
}
