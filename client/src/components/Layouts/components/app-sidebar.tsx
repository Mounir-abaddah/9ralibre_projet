import {
  Book,
  BookOpen,
  Bot,
  Settings2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"


import Navmain from "@/components/Layouts/components/navmain"
import Footuser from "./footeruser"
import TeamSwitcherHeader from "./teamSwitcherHeader"


const data = {
  navMain: [
    {
      title: "Niveaux",
      url: "#",
      icon: Book,
      isActive: true,
    collegeItems: [
      { 
        title: "1AC", 
        url: "/niveaux/college/1AC",
      },
      { 
        title: "2AC", 
        url: "/niveaux/college/2AC" 
      },
      { 
        title: "3AC", 
        url: "/niveaux/college/3AC" 
      },
    ],
    lyceeItems: [
      { 
        title: "TC",
        url: "/niveaux/lycee/TC" 
      },
      { 
        title: "1BAC",
        url: "/niveaux/lycee/1BAC" 
      },
      { 
        title: "2BAC",
        url: "/niveaux/lycee/2BAC" 
      },
    ]
    },
    {
      title: "Cours",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Message",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Parametre",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcherHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Navmain items={data.navMain}/>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Footuser />
      </SidebarFooter>
    </Sidebar>
  )
}