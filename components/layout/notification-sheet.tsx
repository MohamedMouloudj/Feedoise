"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell } from "lucide-react";

export function NotificationSheet() {
  return (
    <Sheet>
      <SheetTrigger
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
      </SheetTrigger>
      <SheetContent className="p-3">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">No new notifications</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
