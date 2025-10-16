"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../_components/AppSidebar";
import ProfilePageContent from "./ProfilePageContent"; 

export default function ProfilePage() {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 p-4 sm:p-6">
        {/* Header with sidebar trigger (for mobile) */}
        <div className="sm:hidden flex flex-col mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold ml-2">Neurolearn</h1>
            </div>
          </div>

          {/* Divider line */}
          <hr className="mt-2 border-gray-200" />
        </div>

        {/* Page Content */}
        <ProfilePageContent />
      </main>
    </SidebarProvider>
  );
}
