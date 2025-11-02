import { XCircle } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

export interface Coursitems{
    name:string
}
export interface CoursMatiere{
    items:Coursitems[]
    onChangeMatiere?: (name: string) => void
    onChangeSemestre?: (name: string) => void
    onChangeType?: (name: string) => void
    selectedMatiere?: string | null
    selectedSemestre?: string | null
    selectedType?: string | null
}
const Matiere = ({  items,
    onChangeMatiere,
    onChangeSemestre,
    onChangeType,
    selectedMatiere,
    selectedSemestre,
    selectedType,}:CoursMatiere) => {
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
    <div className="flex h-20 w-full items-center justify-end gap-2">
        <div className="flex">
            {selectedMatiere && (<span className="cursor-pointer" onClick={()=>onChangeMatiere?.("")}><XCircle color="#FF8A8A" strokeWidth={3} size={14}/></span>)}
            <Select value={selectedMatiere ?? ""} onValueChange={(value)=>{onChangeMatiere?.(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Matières" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Choisissez une matière</SelectLabel>
                    {items.map((item,index)=>(
                    <SelectItem key={index} value={item.name} className={`${bgItems[item.name as keyof typeof bgItems]}`}>{item.name}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
    <div className="flex">
        {selectedSemestre && (<span className="cursor-pointer" onClick={()=>onChangeSemestre?.("")}><XCircle color="#FF8A8A" strokeWidth={3} size={14}/></span>)}
        <Select value={selectedSemestre ?? ""} onValueChange={(value)=>{onChangeSemestre?.(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Choisissez votre Semestre</SelectLabel>
                    <SelectItem value="Premier Semestre">Premier Semestre</SelectItem>
                    <SelectItem value="Deuxième Semestre">Deuxième semestre</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
    <div className="flex">
        {selectedType && (<span className="cursor-pointer" onClick={()=>onChangeType?.("")}><XCircle color="#FF8A8A" strokeWidth={3} size={14}/></span>)} 
        <Select value={selectedType ?? ""} onValueChange={(value)=>{onChangeType?.(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Selectionner votre type</SelectLabel>
                    <SelectItem value="Cours">Cours</SelectItem>
                    <SelectItem value="Exercice">Exercice</SelectItem>
                    <SelectItem value="Examen National">Examen Nationnaux</SelectItem>
                    <SelectItem value="Examen Régional">Examen Régionnaux</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
    </div>
  )
}

export default Matiere
