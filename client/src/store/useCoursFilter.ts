import { create } from "zustand";

/** Filtres des pages élève (liste cours / vidéos). Pour les formulaires prof, la matière par défaut vient du profil (`matiere` sur `/prof/profile`). */
export interface CoursType{
    matiere:string|null,
    semestre:string|null,
    type:string|null,
    filiere:string|null
    search?:string|null
    setMatiere:(matiere:string|null)=>void,
    setSemestre:(semestre:string|null)=>void,
    setType:(type:string|null)=>void
    setFiliere:(filiere:string|null)=>void
    setSearch:(title:string|null)=>void
    resetAll:()=>void
}

export const useCoursFilter = create<CoursType>((set)=>({
    matiere:null,
    semestre:null,
    type:null,
    filiere:null,
    search:null,
    setMatiere:(matiere)=>set({matiere}),
    setSemestre:(semestre)=>set({semestre}),
    setType:(type)=>set({type}),
    setFiliere:(filiere)=>set({filiere}),
    setSearch:(search)=>set({search}),
    resetAll:()=>set({matiere:null,semestre:null,type:null,filiere:null,search:null})
}))