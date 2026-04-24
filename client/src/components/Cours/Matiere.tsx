import { XCircle } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"
import axios from "axios"

export interface Coursitems{
    nom:string
}
export interface CoursMatiere{
    onChangeMatiere?: (name: string) => void
    onChangeSemestre?: (name: string) => void
    onChangeType?: (name: string) => void
    onChangeFiliere?:(name:string)=>void
    selectedMatiere?: string | null
    selectedSemestre?: string | null
    selectedType?: string | null
    selectedFiliere?:string|null
    niveaux?:string
}
const Matiere = ({
    onChangeMatiere,
    onChangeSemestre,
    onChangeType,
    onChangeFiliere,
    selectedMatiere,
    selectedSemestre,
    selectedType,
    selectedFiliere,niveaux}:CoursMatiere) => {

        const apiUrl = import.meta.env.VITE_API_URL;
        const [matieres, setMatieres] = useState<Coursitems[]>([]);
        const bgItems = {
            "Mathématiques":"data-[state=checked]:bg-red-400",
            "Physique et Chimie":"data-[state=checked]:bg-cyan-400",
            "Sciences de la Vie et de la Terre (SVT)":"data-[state=checked]:bg-teal-400",
            "Informatique":"data-[state=checked]:bg-sky-400",
            "Arabe":"data-[state=checked]:bg-orange-400",
            "Français":"data-[state=checked]:bg-orange-400",
            "Anglais":"data-[state=checked]:bg-orange-400",
            "Histoire Géographie":"data-[state=checked]:bg-amber-400",
            "Éducation Islamique":"data-[state=checked]:bg-blue-400",
        }

        useEffect(() => {
            if (!niveaux) return;

            const getMatiere = async () => {
                try {
                const res = await axios.get(
                    `${apiUrl}/user/fetch-matiere/${niveaux}`,
                    { withCredentials: true }
                );

                setMatieres(res.data); // 🔥 IMPORTANT
                } catch (err) {
                console.error(err);
                }
            };

            getMatiere();
        }, [niveaux]);


    
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex w-full">
            {selectedMatiere && (<span className="cursor-pointer" onClick={()=>onChangeMatiere?.("")}><XCircle color="#FF8A8A" strokeWidth={3} size={14}/></span>)}
            <Select value={selectedMatiere ?? ""} onValueChange={(value)=>{onChangeMatiere?.(value)}}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Matières" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Choisissez une matière</SelectLabel>
                    {matieres.map((item, index) => (
                        <SelectItem
                            key={index}
                            value={item.nom}
                            className={`${bgItems[item.nom as keyof typeof bgItems]}`}
                        >
                            {item.nom}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
        </div>
    <div className="flex">
        {selectedSemestre && (<span className="cursor-pointer" onClick={()=>onChangeSemestre?.("")}><XCircle color="#FF8A8A" strokeWidth={3} size={14}/></span>)}
        <Select value={selectedSemestre ?? ""} onValueChange={(value)=>{onChangeSemestre?.(value)}}>
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Selectionner votre type</SelectLabel>
                    <SelectItem value="Cours">Cours</SelectItem>
                    <SelectItem value="Exercice">Exercice</SelectItem>
                    <SelectItem value="Examen">Examen</SelectItem>
                    {niveaux === "3AC" || niveaux === "1BAC" && <SelectItem value="Examen Régional">Examen Régionnaux</SelectItem>}
                    {niveaux === "2BAC" && <SelectItem value="Examen National">Examen Nationnaux</SelectItem>}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
    {(niveaux === "TC" || niveaux === "1BAC" || niveaux === "2BAC") && (
    <div className="flex">
        {selectedFiliere && (<span className="cursor-pointer" onClick={()=>onChangeFiliere?.("")}><XCircle color="#FF8A8A" strokeWidth={3} size={14}/></span>)} 
        <Select value={selectedFiliere ?? ""} onValueChange={(value)=>{onChangeFiliere?.(value)}}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Filière" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Selectionner votre Filière</SelectLabel>
                {niveaux === "TC" ? (
                    <>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                    <SelectItem value="Technologies">Technologies</SelectItem>
                    <SelectItem value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</SelectItem>
                    </>
                ): niveaux === "1BAC" ?(
                    <>
                    <SelectItem value="Sciences Mathématiques">Sciences Mathématiques</SelectItem>
                    <SelectItem value="Sciences Expérimentales">Sciences Expérimentales</SelectItem>
                    <SelectItem value="Sciences et Technologies Électriques">Sciences et Technologies Électriques</SelectItem>
                    <SelectItem value="Sciences et Technologies Mécaniques">Sciences et Technologies Mécaniques</SelectItem>
                    <SelectItem value="Sciences Économiques et Gestion">Sciences Économiques et Gestion</SelectItem>
                    <SelectItem value="Lettres et Sciences Humaines">Lettres et Sciences Humaines</SelectItem>
                    </>
                ):(
                    <>
                    <SelectItem value="Sciences Mathématiques A">Sciences Mathématiques A</SelectItem>
                    <SelectItem value="Sciences Mathématiques B">Sciences Mathématiques B</SelectItem>
                    <SelectItem value="Sciences Physiques">Sciences Physiques</SelectItem>
                    <SelectItem value="Sciences de la Vie et de la Terre (SVT)">Sciences de la Vie et de la Terre (SVT)</SelectItem>
                    <SelectItem value="Sciences Agronomiques">Sciences Agronomiques</SelectItem>
                    <SelectItem value="Sciences et Technologies Électriques">Sciences et Technologies Électriques</SelectItem>
                    <SelectItem value="Sciences et Technologies Mécaniques">Sciences et Technologies Mécaniques</SelectItem>
                    <SelectItem value="Sciences Économiques">Sciences Économiques</SelectItem>
                    <SelectItem value="Sciences de Gestion Comptable (SGC)">Sciences de Gestion Comptable (SGC)</SelectItem>
                    <SelectItem value="Lettres">Lettres</SelectItem>
                    <SelectItem value="Sciences Humaines">Sciences Humaines</SelectItem>
                    </>
                )}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
    )}
    </div>
  )
}

export default Matiere
