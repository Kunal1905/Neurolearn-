import React from "react";
import WorkspaceProvider from "./provider";

function WorkspaceLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be inside WorkspaceProvider most likely */}
      <WorkspaceProvider>
        {/* Right-side content area */}
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>
      </WorkspaceProvider>
    </div>
  );
}

export default WorkspaceLayout;
