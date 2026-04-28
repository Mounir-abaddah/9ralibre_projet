import type { PropsWithChildren } from "react";
import { useLocation, Link } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { AppSidebar } from "../Dashboard/Sidebar/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

import { Separator } from "../ui/separator";

const LayoutsProf = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const path = location.pathname;

  // 🧠 mapping des routes
  const breadcrumbMap: Record<string, string> = {
    "/prof/dashboard": "Dashboard",
    "/prof/calendrier": "Calendrier",
    "/prof/cours": "Cours",
    "/prof/videos": "Videos",
    "/prof/quiz": "Quiz",
    "/prof/chat": "Chat",
    "/prof/settings": "Paramètres",
  };

  // 🧠 gestion des routes dynamiques
  let currentLabel = breadcrumbMap[path];

  if (path.startsWith("/prof/Chat/start")) {
    currentLabel = "Chat";
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/prof/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {path !== "/prof/dashboard" && currentLabel && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {currentLabel}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* CONTENT */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayoutsProf;