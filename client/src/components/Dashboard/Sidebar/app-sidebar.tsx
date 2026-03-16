"use client"

import * as React from "react"
import {
  BookOpen,
  Settings2,
  Table2,
  Video,
  MessageCircleMore,
  BookType,
} from "lucide-react"
import { NavMain } from "@/components/Dashboard/Sidebar/nav-main"
import { NavUser } from "@/components/Dashboard/Sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import logo from '@/assets/images/9ralibre.png'
import { Collapsible } from "@/components/ui/collapsible"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/prof/dashboard",
      icon: Table2,
      isActive: true,
    },
    {
      title: "Cours",
      url: "/prof/cours",
      icon: BookOpen,
    },
    {
      title: "Videos",
      url: "/prof/videos",
      icon: Video,
    },
    {
      title: "Quiz",
      url: "/prof/quiz",
      icon: BookType,
    },
    {
      title: "Messagerie",
      url: "/prof/chat",
      icon: MessageCircleMore,
    },
    {
      title: "Paramètre",
      url: "/prof/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Collapsible className="group/collapsible">
          <div  className="flex items-center">
            <img src={logo} alt="logo_du_site" width={50}/>
            <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">9ralibre</span>
              <span className="truncate text-xs">Espace Professeur</span>
            </div>
          </div>
        </Collapsible>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
