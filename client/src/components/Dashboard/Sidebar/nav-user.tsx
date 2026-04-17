
import {
  ChevronsUpDown,
  LogOut,
  Moon,
  Settings,
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
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/context/ThemeContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export function NavUser() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isMobile } = useSidebar()
  const {data} = useProtectedRoutes();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async()=>{
    await axios.post(`${apiUrl}/prof/logout`,{},{withCredentials:true})
    if(data?.role === "Professeur"){
      navigate(`/prof-connexion`);
    }

    if(data?.role === "Admin"){
      navigate(`/admin-connexion`);
    }
    
    window.location.reload()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`${apiUrl}/uploads/images/${data?.id}/${data?.image}`} alt={data?.nom} />
                <AvatarFallback className="rounded-lg uppercase">{data?.nom[0]}{data?.prenom[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data?.nom} {data?.prenom}</span>
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
                  <AvatarFallback className="rounded-lg uppercase">{data?.nom[0]}{data?.prenom[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data?.nom}</span>
                  <span className="truncate text-xs">{data?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                <Moon size={16} />
                <span>Mode sombre</span>
              </div>

              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              </DropdownMenuItem>
              {data?.role === "Professeur" && (
                <DropdownMenuItem className="cursor-pointer" onClick={()=>navigate('/prof/settings')}>
                  <Settings />
                  Paramètre
                </DropdownMenuItem>
              )}
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>handleLogout()} variant='destructive' className="cursor-pointer">
              <LogOut />
              Se déconnecter 
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
