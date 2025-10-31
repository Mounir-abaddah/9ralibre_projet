import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

export interface Coursitems{
    name:string
}
export interface CoursMatiere{
    items:Coursitems[]
    onSelect?:(name:string)=>void
}
const Matiere = ({items,onSelect}:CoursMatiere) => {
    const [active,setActive] = useState<string |null>(null);
    const bgItems = {
        "Mathématiques":"data-[state=checked]:bg-red-400",
        "Physique et Chimie":"data-[state=checked]:bg-cyan-400",
        "SVT":"data-[state=checked]:bg-teal-400",
        "Informatique":"data-[state=checked]:bg-sky-400",
        "Arabe":"data-[state=checked]:bg-orange-400",
        "Français":"data-[state=checked]:bg-orange-400",
        "Anglais":"data-[state=checked]:bg-orange-400",
        "Histoire Géographie":"data-[state=checked]:bg-amber-400",
        "Éducation Islamique":"data-[state=checked]:bg-blue-400",
    }
  return (
    <div className="flex h-20 flex-wrap items-center justify-center gap-2">
        <Select onValueChange={(value)=>{setActive(value);onSelect?.(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choisissez une matière" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Matières</SelectLabel>
                {items.map((item,index)=>(
                <SelectItem key={index} value={item.name} className={`${bgItems[item.name as keyof typeof bgItems]}`}>{item.name}</SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}

export default Matiere
