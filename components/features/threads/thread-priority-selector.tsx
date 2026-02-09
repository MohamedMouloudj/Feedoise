"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateThread } from "@/actions/threads.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AppButton from "@/components/AppButton";

type ThreadPrioritySelectorProps = {
  threadId: string;
  currentPriority: number;
  canUpdate: boolean;
};

export function ThreadPrioritySelector({
  threadId,
  currentPriority,
  canUpdate,
}: ThreadPrioritySelectorProps) {
  const router = useRouter();
  const [priority, setPriority] = useState(currentPriority);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!canUpdate || priority === currentPriority) return;

    setIsUpdating(true);
    try {
      const result = await updateThread(threadId, {
        priorityWeight: priority,
      });

      if (result.success) {
        toast.success("Priority updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update priority");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating priority:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canUpdate) {
    return (
      <div className="space-y-2">
        <Label>Priority</Label>
        <div className="text-sm text-muted-foreground">{currentPriority}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="priority-selector">Priority (0-10)</Label>
      <div className="flex gap-2">
        <Input
          id="priority-selector"
          type="number"
          min="0"
          max="10"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          disabled={isUpdating}
          className="flex-1"
        />
        {priority !== currentPriority && (
          <AppButton
            type="primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            Save
          </AppButton>
        )}
      </div>
    </div>
  );
}
