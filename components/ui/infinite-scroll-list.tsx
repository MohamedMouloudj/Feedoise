"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InfiniteScrollListProps<T> {
  items: T[];
  hasMore: boolean;
  loadMore: () => void;
  isLoading?: boolean;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  skeletonCount?: number;
}

export function InfiniteScrollList<T>({
  items,
  hasMore,
  loadMore,
  isLoading = false,
  renderItem,
  emptyMessage = "No items found",
  className,
  skeletonCount = 3,
}: InfiniteScrollListProps<T>) {
  if (isLoading && items.length === 0) {
    return (
      <div
        className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      }
      endMessage={
        <p className="mt-8 text-center text-sm text-muted-foreground">
          That&apos;s all!
        </p>
      }
    >
      <div
        className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}
      >
        {items.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
