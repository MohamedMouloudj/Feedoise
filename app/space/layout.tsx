import AppSidebar from "@/components/layout/app-sidebar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <AppSidebar />
      <div className="p-5 flex-1">{children}</div>
    </div>
  );
}
