"use client";

import { useState, useEffect, useCallback } from "react";
import { OrganizationCard } from "@/components/features/organizations/organization-card";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { debounce } from "@/lib/debounce";
import { Organization } from "@/lib/generated/prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

type OrganizationWithCounts = Organization & {
  _count: {
    members: number;
    projects: number;
  };
};

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithCounts[]>(
    [],
  );
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const TAKE = 12;

  const fetchOrganizations = async (
    searchTerm: string,
    skipValue: number,
    isNewSearch = false,
  ) => {
    try {
      const response = await fetch(
        `/api/organizations/public?skip=${skipValue}&take=${TAKE}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`,
      );
      const data = await response.json();

      if (isNewSearch) {
        setOrganizations(data.items);
      } else {
        setOrganizations((prev) => [...prev, ...data.items]);
      }
      setHasMore(data.hasMore);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrganizations("", 0, true);
  }, []);

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setIsLoading(true);
      setSkip(0);
      fetchOrganizations(searchTerm, 0, true);
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
    fetchOrganizations(searchQuery, newSkip, false);
  };

  return (
    <div className="container max-w-full p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Discover Organizations</h1>
        <p className="mt-2 text-muted-foreground">
          Explore organizations and their public projects
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations by name..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoading && organizations.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <InfiniteScrollList
          items={organizations}
          hasMore={hasMore}
          loadMore={loadMore}
          renderItem={(organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              href={`/organizations/${organization.slug}`}
            />
          )}
          emptyMessage="No organizations found. Try a different search term."
        />
      )}
    </div>
  );
}
