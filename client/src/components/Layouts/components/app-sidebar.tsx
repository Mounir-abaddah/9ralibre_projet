import {
  Book,
  Bookmark,
  BookOpen,
  BookType,
  Bot,
  MessageCircleMoreIcon,
  Settings2,
  Video,
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
import { useParams } from "react-router-dom"





export function AppSidebar() {
  const {niveaux} = useParams()
  const allInformation = {
  navMain: [
    {
      title: "Cours & Exercice",
      url: `/Cours/${niveaux}`,
      icon: Book,
    },
    {
      title: "Videos",
      url: `/Videos/${niveaux}`,
      icon: Video,
    },
    {
      title: "Test",
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
      title: "Enregistrer",
      url: `/Enregistrer/${niveaux}`,
      icon: Bookmark,
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
      title: "Paramètre",
      url: `/Paramètre/${niveaux}`,
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
  return (
    <Sidebar collapsible="offcanvas">
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