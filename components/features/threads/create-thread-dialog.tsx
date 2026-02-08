"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AppButton from "@/components/AppButton";
import { CreateThreadForm } from "./create-thread-form";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type CreateThreadDialogProps = {
  projectId: string;
};

export function CreateThreadDialog({ projectId }: CreateThreadDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <AppButton type="primary" icon={<Plus className="ml-2 h-4 w-4" />}>
            Create Feedback
          </AppButton>
        }
      >
        <AppButton type="primary" icon={<Plus className="ml-2 h-4 w-4" />}>
          Create Feedback
        </AppButton>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        <CreateThreadForm
          projectId={projectId}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
