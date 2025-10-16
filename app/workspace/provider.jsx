"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./_components/AppSidebar";

function WorkspaceProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 items-center min-h-screen">{children}</main>
    </SidebarProvider>
  );
}

export default WorkspaceProvider;
