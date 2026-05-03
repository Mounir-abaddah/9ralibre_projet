import axios from 'axios';
import { create } from 'zustand';

export interface typedata{
    _id?:string
    id: string,
    nom: string,
    prenom: string,
    email: string,
    role: 'Non renseigné'| 'Etudiant' |'Etudiante' | 'Professeur' | 'Admin',
    niveaux: '1AC' | '2AC' | '3AC' | 'TC'| '1BAC' | '2BAC',
    image:string
    accountVerified: boolean
    provider:"local"| "google"
    completeProfile:boolean
    followers:string[]
}

export interface typeAllData{
    data:typedata | null
    loading:boolean
    error:string | null
    fetchData:()=>Promise<void>
}

export interface typedataProf{
    _id:string
    id:string,
    nom: string,
    prenom: string,
    email: string,
    niveaux:string,
    image:string
    /** Matière d’enseignement choisie à l’inscription (pour pré-remplir les formulaires). */
    matiere?: { _id: string; nom: string } | null;
    accountVerified: boolean
    completeProfile:boolean
    followers:string[]
    provider:"local"| "google";
    quiz:string;
    videos:string;
    totalViews:number
}

export interface typeAllDataProf{
    data:typedataProf | null
    loading:boolean
    error:string | null
    fetchData:()=>Promise<void>
}

export const useProtectedRoutes = create<typeAllData>()((set)=>({
    data:null,
    loading:true,
    error:null,
    fetchData:async()=>{
        try{
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/user/profile`,{withCredentials:true});
            set({data:response.data.user,loading:false,error:null})
        }catch(err){
            let message = "Une erreure est survenu";
            if(axios.isAxiosError(err)){
                message = err.response?.data?.message || err.message || message
            }
            set({data:null,error:message,loading:false})
        }
    }
}));


export const useProfProtectedRoutes = create<typeAllDataProf>()((set)=>({
    data:null,
    loading:true,
    error:null,
    fetchData:async()=>{
        try{
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/prof/profile`,{withCredentials:true});
            const profData = {
                ...response.data.user,
                quiz: response.data.quiz,
                videos: response.data.videos,
                totalViews: response.data.totalViews
            }
            set({data:profData,loading:false,error:null})
        }catch(err){
            let message = "Une erreure est survenu";
            if(axios.isAxiosError(err)){
                message = err.response?.data?.message || err.message || message
            }
            set({data:null,error:message,loading:false})
        }
    }
}));