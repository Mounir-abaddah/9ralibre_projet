import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react"

const Footuser = () => {
  const { isMobile } = useSidebar();
  const apiUrl = import.meta.env.VITE_API_URL

  const {data,fetchData} = useProtectedRoutes();

  useEffect(()=>{
    fetchData()
  },[fetchData])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`${apiUrl}/uploads/images/${data?.id}/${data?.image}`} alt={data?.nom} />
                <AvatarFallback className={`rounded-lg text-white ${data?.role === "Etudiant" ? "bg-sky-300" : "bg-pink-400"}`}>{data?.nom.charAt(0).toUpperCase()}{data?.prenom.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data?.prenom}</span>
                <span className={`px-2 py-[2px] rounded-md text-[10px] font-medium uppercase tracking-wide
                    ${data?.role === "Etudiant" ? "bg-gradient-to-r from-sky-500 to-sky-700 text-white" :
                      data?.role === "Etudiante" ? "bg-gradient-to-r from-pink-500 to-pink-700 text-white" :
                      "bg-gray-200 text-gray-700"}`}
                >
                  {data?.role}
                </span>
                <span className="truncate text-xs">{data?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`${apiUrl}/uploads/images/${data?.id}/${data?.image}`} alt={data?.nom} />
                  <AvatarFallback className="rounded-lg">{data?.nom.charAt(0).toUpperCase()}{data?.prenom.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data?.nom} {data?.prenom}</span>
                  
                  <span className="truncate text-xs">{data?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-red-500 text-white cursor-pointer hover:bg-red-600">
              <LogOut />
                Se deconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default Footuser