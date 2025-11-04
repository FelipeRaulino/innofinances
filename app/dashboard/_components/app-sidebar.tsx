"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Error on logout.");
      }
    } catch (error) {
      console.error("Error on network", error);
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className="rounded-none flex flex-col items-center h-auto gap-6 mt-4 mb-4">
            <Image src="./logo.svg" width={164} height={42} alt="Logo" />
            <Separator orientation="horizontal" className="" />
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem key="dashboard">
              <SidebarMenuButton asChild isActive>
                <a href="#" className="h-10 py-6">
                  <LayoutDashboard width={20} height={20} />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter className="px-4">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem key="logout">
              <SidebarMenuButton
                asChild
                className="transition-colors ease-in delay-50"
              >
                <div
                  className="h-10 py-6 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut width={20} height={20} />
                  <span>Logout</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
