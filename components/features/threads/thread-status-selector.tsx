"use client";

import { useState } from "react";
import { ThreadStatus } from "@/lib/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateThread } from "@/actions/threads.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ThreadStatusSelectorProps = {
  threadId: string;
  currentStatus: ThreadStatus;
  canUpdate: boolean;
};

const statusLabels: Record<ThreadStatus, string> = {
  new: "New",
  under_review: "Under Review",
  planned: "Planned",
  completed: "Completed",
  wont_fix: "Won't Fix",
};

export function ThreadStatusSelector({
  threadId,
  currentStatus,
  canUpdate,
}: ThreadStatusSelectorProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string | null) => {
    if (!canUpdate || !newStatus || newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const result = await updateThread(threadId, {
        status: newStatus as ThreadStatus,
      });

      if (result.success) {
        toast.success("Status updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canUpdate) {
    return (
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="text-sm text-muted-foreground">
          {statusLabels[currentStatus]}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="status-selector">Status</Label>
      <Select
        value={currentStatus}
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger id="status-selector">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="under_review">Under Review</SelectItem>
          <SelectItem value="planned">Planned</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="wont_fix">Won&apos;t Fix</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
