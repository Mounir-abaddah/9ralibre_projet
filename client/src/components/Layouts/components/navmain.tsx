
import {University, type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const navigate = useNavigate();
  const location = useLocation()
  const {niveaux} = useParams();

  return (
    <SidebarGroup>
      <SidebarGroup className="w-full">
        <SidebarGroupLabel className="flex items-center justify-start gap-2 ">
          <University strokeWidth={2} color="#000" className="size-4.5"/>
          <span>Niveaux</span>
        </SidebarGroupLabel>
      <Select value={niveaux} onValueChange={(value) => {
        const enumNiveaux = ['1AC','2AC','3AC'].includes(value)
        if(enumNiveaux){
          navigate(decodeURIComponent(`/Dashboard/Collège/${value}`))
        }
        if(!enumNiveaux){
          navigate(decodeURIComponent(`/Dashboard/Lycée/${value}`))
        }
      }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selectionnez votre niveaux" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectLabel>Collège</SelectLabel>
            <SelectItem value="1AC">1AC</SelectItem>
            <SelectItem value="2AC">2AC</SelectItem>
            <SelectItem value="3AC">3AC</SelectItem>
            <SelectLabel>Lycée</SelectLabel>
            <SelectItem value="TC">TC</SelectItem>
            <SelectItem value="1BAC">1BAC</SelectItem>
            <SelectItem value="2BAC">2BAC</SelectItem>
          </SelectGroup>
        </SelectContent>
    </Select>
      </SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const activeItem = location.pathname === item.url;
          return(
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} className={`${activeItem && 'rounded-md bg-amber-400 p-2 transition-all hover:bg-amber-500 active:bg-amber-600'} w-full`}>
                  {item.icon && <item.icon />}
                  <Link to={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )})}
        
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain