import {
  Book,
  BookOpen,
  BookType,
  Bot,
  MessageCircleMoreIcon,
  Settings2,
  University,
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



const allInformation = {
  navMain: [
    {
      title: "Niveaux",
      url: "#",
      icon: University,
      isActive: true,
    collegeItems: [
      { 
        title: "1AC", 
        url: "/Dashboard/Collège/1AC",
      },
      { 
        title: "2AC", 
        url: "/Dashboard/Collège/2AC" 
      },
      { 
        title: "3AC", 
        url: "/Dashboard/Collège/3AC" 
      },
    ],
    lyceeItems: [
      { 
        title: "TC",
        url: "/Dashboard/Lycée/TC" 
      },
      { 
        title: "1BAC",
        url: "/Dashboard/Lycée/1BAC" 
      },
      { 
        title: "2BAC",
        url: "/Dashboard/Lycée/2BAC" 
      },
    ]
    },
    {
      title: "Cours",
      url: "#",
      icon: Book,
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
      title: "Exercice",
      url: "#",
      icon: BookType,
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
      title: "Histoire",
      url: "#",
      icon: BookOpen,
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
      title: "Messagerie",
      url: "#",
      icon: MessageCircleMoreIcon,
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
      title: "Intelligence artificielle",
      url: "#",
      icon: Bot,
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
          <Navmain items={allInformation.navMain}/>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Footuser />
      </SidebarFooter>
    </Sidebar>
  )
}