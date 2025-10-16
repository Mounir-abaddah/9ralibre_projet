"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react"

const NavMain = ({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
    collegeItems?: { 
      title: string;
      url: string 
    }[]
    lyceeItems?: { 
      title: string; 
      url: string 
    }[]
  }[]
}) => {
  const {data,fetchData} = useProtectedRoutes();

  useEffect(()=>{
    fetchData();
  },[fetchData]);

  const isCollegeOpen = data?.niveaux === "1AC" || data?.niveaux === "2AC" || data?.niveaux === "3AC";

  const isLyceeOpen = data?.niveaux === "TC" || data?.niveaux === "1BAC" || data?.niveaux === "2BAC";


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  {item.collegeItems && item.collegeItems.length > 0 && (
                    <Collapsible className="group/college" asChild defaultOpen={isCollegeOpen}>
                      <SidebarMenuSubItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton>
                            <span>Collège</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/college:rotate-90" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1">
                            {item.collegeItems.map((subItem) => {
                              const isActive = location.pathname === subItem.url
                              return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.url} className="w-full">
                                    <span className={`${isActive ? 'bg-amber-500' : 'bg-none'} p-1 rounded-md w-full`}>{subItem.title}</span>
                                    <span className="text-teal-400 text-xs font-semibold absolute right-4">{subItem.title === data?.niveaux && '(actuelle)'}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuSubItem>
                    </Collapsible>
                  )}
                  {item.lyceeItems && item.lyceeItems.length > 0 && (
                    <Collapsible className="group/college" asChild defaultOpen={isLyceeOpen}>
                      <SidebarMenuSubItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton>
                            <span>Lycée</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/college:rotate-90" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1">
                            {item.lyceeItems.map((subItem) => {
                              const isActive = location.pathname === subItem.url
                              return(
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.url}>
                                    <span className={`${isActive ? 'bg-amber-300' : 'bg-none'}`}>{subItem.title}</span>
                                    <span className="text-teal-400 text-xs font-medium">{subItem.title === data?.niveaux && '(actuelle)'}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )})}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuSubItem>
                    </Collapsible>
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
            
          </Collapsible>
        ))}
        
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain