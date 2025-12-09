import type { Commentaire } from '@/pages/auth/Videos/Video';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import { EllipsisVertical, Flag, Plus } from 'lucide-react';


interface DropdownMenuItemCommentsProps {
  item: Commentaire;
}

const CommentsDropDown = ({item}:DropdownMenuItemCommentsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><EllipsisVertical size={20} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Flag />Signaler
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Plus /> Suivre {item.user.nom} {item.user.prenom}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CommentsDropDown