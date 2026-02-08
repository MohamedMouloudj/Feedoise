"use client";

import { ThreadStatus } from "@/lib/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ThreadFiltersProps = {
  selectedStatus?: ThreadStatus | "all";
  selectedSort?: "recent" | "priority" | "discussed";
  onStatusChange: (status: ThreadStatus | "all") => void;
  onSortChange: (sort: "recent" | "priority" | "discussed") => void;
};

export function ThreadFilters({
  selectedStatus = "all",
  selectedSort = "recent",
  onStatusChange,
  onSortChange,
}: ThreadFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 space-y-2">
        <Label htmlFor="status-filter">Filter by Status</Label>
        <Select
          value={selectedStatus}
          onValueChange={(value) => value && onStatusChange(value)}
          //   defaultValue="all"
        >
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="wont_fix">Won&apos;t Fix</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="sort-filter">Sort by</Label>
        <Select
          value={selectedSort}
          onValueChange={(value) => value && onSortChange(value)}
        >
          <SelectTrigger id="sort-filter">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="discussed">Most Discussed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
