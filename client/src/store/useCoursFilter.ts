import { create } from "zustand";

interface CoursType{
    matiere:string|null,
    semestre:string|null,
    type:string|null,
    setMatiere:(matiere:string|null)=>void,
    setSemestre:(semestre:string|null)=>void,
    setType:(type:string|null)=>void
    resetAll:()=>void
}

export const useCoursFilter = create<CoursType>((set)=>({
    matiere:null,
    semestre:null,
    type:null,
    setMatiere:(matiere)=>set({matiere}),
    setSemestre:(semestre)=>set({semestre}),
    setType:(type)=>set({type}),
    resetAll:()=>set({matiere:null,semestre:null,type:null})
}))