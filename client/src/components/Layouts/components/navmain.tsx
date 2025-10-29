
import { ChevronRight, University, type LucideIcon } from "lucide-react"

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
import { Link, useNavigate, useParams } from "react-router-dom"

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
  const {niveaux} = useParams();

  return (
    <SidebarGroup>
      <SidebarGroup className="w-full">
        <SidebarGroupLabel className="flex items-center gap-2 ">
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