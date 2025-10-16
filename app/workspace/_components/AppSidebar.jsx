"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Brain, MessageSquare, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SideBarOptions = [
  { title: "Assessment", icon: Brain, path: "/workspace/assessment" },
  { title: "Chat Assistant", icon: MessageSquare, path: "/workspace/chat-assistant" },
  { title: "Profile", icon: User, path: "/workspace/profile" },
];

export default function AppSidebar() {
  const path = usePathname();
  const { user, isLoaded } = useUser();
  const [dominantSide, setDominantSide] = useState(null);

  // ✅ Fetch dominant side from DB
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchDominantSide = async () => {
      try {
        const res = await fetch(`/api/user/${user.id}/dominant`);
        const data = await res.json();
        if (data.success) {
          setDominantSide(data.dominant_side);
        }
      } catch (error) {
        console.error("❌ Error fetching dominant side:", error);
      }
    };

    fetchDominantSide();
  }, [isLoaded, user]);

  return (
    <Sidebar className="w-64 min-h-screen bg-white border-r shadow-sm">
      {/* Logo */}
      <SidebarHeader className="flex items-center justify-center border-b py-4">
        <Image src="/logo.svg" width={260} height={120} alt="logo" />
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <h2 className="text-xs font-bold text-gray-500 mb-2">LEARNING HUB</h2>
              {SideBarOptions.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 p-2 rounded-md ${
                        path === item.path ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Brain Type Card */}
        <SidebarGroup className="mt-6">
          <SidebarGroupContent>
            <div className="p-4 rounded-lg bg-gray-50 border shadow-sm">
              <div className="flex items-center gap-2">
                <Brain className="text-blue-500 w-5 h-5" />
                <h3 className="text-sm font-medium text-gray-700">Brain Type</h3>
              </div>
              <p className="mt-1 font-semibold text-sm">
                {dominantSide ? dominantSide : "Not tested yet"}
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user?.fullName || "User"}</span>
            <span className="text-xs text-gray-500">Neural Learner</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
