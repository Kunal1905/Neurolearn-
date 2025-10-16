// app/assessment/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../_components/AppSidebar";
import AssessmentIntro from "./AssessmentIntro";
import BrainResults from "./results/page";

export default function AssessmentPage() {
  const { user, isLoaded } = useUser();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const checkAssessment = async () => {
      try {
        // No need to pass userId since we're using server-side auth
        const res = await fetch(`/api/assessment-status`);
        const data = await res.json();
        console.log("assessment-status response:", data);

        if (data?.exists) {
          setAssessment({
            leftScore: data.leftScore,
            rightScore: data.rightScore,
            dominantSide: data.dominantSide,
            createdAt: data.createdAt,
          });
        }
      } catch (err) {
        console.error("Error fetching assessment:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAssessment();
  }, [isLoaded, user]);

  if (loading)
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6">
          {/* Header with sidebar trigger (for mobile) */}
          <div className="sm:hidden flex flex-col mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold ml-2">Neurolearn</h1>
              </div>
            </div>
            <hr className="mt-2 border-gray-200" />
          </div>
          
          <div className="flex justify-center min-h-screen p-8">
            Checking assessment status…
          </div>
        </main>
      </SidebarProvider>
    );
  if (!user)
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6">
          {/* Header with sidebar trigger (for mobile) */}
          <div className="sm:hidden flex flex-col mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold ml-2">Neurolearn</h1>
              </div>
            </div>
            <hr className="mt-2 border-gray-200" />
          </div>
          
          <div className="flex items-center justify-center min-h-screen">
            Please sign in to access the assessment.
          </div>
        </main>
      </SidebarProvider>
    );
  if (!assessment) return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6">
        {/* Header with sidebar trigger (for mobile) */}
        <div className="sm:hidden flex flex-col mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold ml-2">Neurolearn</h1>
            </div>
          </div>
          <hr className="mt-2 border-gray-200" />
        </div>
        
        <AssessmentIntro />
      </main>
    </SidebarProvider>
  );
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6">
        {/* Header with sidebar trigger (for mobile) */}
        <div className="sm:hidden flex flex-col mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold ml-2">Neurolearn</h1>
            </div>
          </div>
          <hr className="mt-2 border-gray-200" />
        </div>
        
        <BrainResults
          left={assessment.leftScore}
          right={assessment.rightScore}
          dominant={assessment.dominantSide}
        />
      </main>
    </SidebarProvider>
  );
}
