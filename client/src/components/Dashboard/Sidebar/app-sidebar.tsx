"use client";

import * as React from "react";
import {
  BookOpen,
  Settings2,
  Table2,
  Video,
  MessageCircleMore,
  BookType,
  Users,
  Flag,
  ScrollText,
  MailWarning,
  UserCheck2,
  Calendar1,
} from "lucide-react";
import { NavMain } from "@/components/Dashboard/Sidebar/nav-main";
import { NavUser } from "@/components/Dashboard/Sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import logo from "/assets/images/9ralibre.png";
import { Collapsible } from "@/components/ui/collapsible";
import { useProtectedRoutes } from "@/store/userStore";
import { useTranslation } from "react-i18next";

const dataAdmin = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Table2,
      isActive: true,
    },
    {
      title: "Utilisateur",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Professeurs",
      url: "/admin/professors",
      icon: UserCheck2,
    },
    {
      title: "Signalement",
      url: "/admin/signals",
      icon: Flag,
    },
    {
      title: "Moderation log",
      url: "/admin/moderation-log",
      icon: ScrollText,
    },
    {
      title: "Appeals",
      url: "/admin/appeals",
      icon: MailWarning,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, fetchData } = useProtectedRoutes();
  const { t } = useTranslation();

  const dataProfesseur = {
    navMain: [
      {
        title: t("prof.sidebar.dashboard"),
        url: "/prof/dashboard",
        icon: Table2,
        isActive: true,
      },
      {
        title: t("prof.sidebar.calendar"),
        url: "/prof/calendrier",
        icon: Calendar1,
        isActive: true,
      },
      { title: t("prof.sidebar.courses"), url: "/prof/cours", icon: BookOpen },
      { title: t("prof.sidebar.videos"), url: "/prof/videos", icon: Video },
      { title: t("prof.sidebar.quiz"), url: "/prof/quiz", icon: BookType },
      {
        title: t("prof.sidebar.messaging"),
        url: "/prof/chat",
        icon: MessageCircleMore,
      },
      {
        title: t("prof.sidebar.settings"),
        url: "/prof/settings",
        icon: Settings2,
      },
    ],
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Collapsible className="group/collapsible">
          <div className="flex items-center">
            <img src={logo} alt="logo_du_site" width={50} />
            <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">9ralibre</span>
              <span className="truncate text-xs">
                {data?.role === "Professeur"
                  ? t("prof.sidebar.teacherSpace")
                  : t("prof.sidebar.adminSpace")}
              </span>
            </div>
          </div>
        </Collapsible>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            data?.role === "Professeur"
              ? dataProfesseur.navMain
              : dataAdmin.navMain
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
