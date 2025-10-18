import logo from '@/assets/images/logo.png'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from 'react-router-dom'


const TeamSwitcherHeader = () => {
    const navigate = useNavigate();    
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton 
                            size={"lg"}
                            className="hover:bg-sidebar-accent cursor-pointer"
                            onClick={()=>navigate('/')}
                        >
                            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <img src={logo} alt="logo du site" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium text-amber-500">9ral<span className="text-sky-500">ibre</span></span>
                                <span className="truncate text-xs text-muted-foreground">Plateforme éducative</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default TeamSwitcherHeader