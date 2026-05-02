
import {
  ChevronsUpDown,
  Languages,
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
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"

export function NavUser() {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isMobile } = useSidebar()
  const {data} = useProtectedRoutes();
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "Fr");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang.toLowerCase());
  }, [lang]);

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
              <DropdownMenuItem className="flex cursor-default items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages size={16} />
                  <span>{t("nav.language")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size={'icon-sm'}
                    variant={'outline'}
                    type="button"
                    className={`cursor-pointer rounded px-2 py-1 text-xs ${
                      lang === "Fr"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                    onClick={() => {setLang("Fr");window.location.reload()}}
                  >
                    FR
                  </Button>
                  <Button
                    size={"icon-sm"}
                    variant={'outline'}
                    type="button"
                    className={`rounded text-xs ${
                      lang === "En"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                    onClick={() => {setLang("En");window.location.reload()}}
                  >
                    EN
                  </Button>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                <Moon size={16} />
                <span>{t("nav.darkMode")}</span>
              </div>

              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              </DropdownMenuItem>
              {data?.role === "Professeur" && (
                <DropdownMenuItem className="cursor-pointer" onClick={()=>navigate('/prof/settings')}>
                  <Settings />
                  {t("nav.settings")}
                </DropdownMenuItem>
              )}
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>handleLogout()} variant='destructive' className="cursor-pointer">
              <LogOut />
              {t("nav.logout")} 
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
