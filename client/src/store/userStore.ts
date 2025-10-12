import axios from 'axios';
import { create } from 'zustand';

interface typedata{
    id: string,
    nom: string,
    prenom: string,
    email: string,
    role: 'Non renseigné'| 'Etudiant' |'Etudiante',
    niveaux: '1AC' | '2AC' | '3AC' | 'TC'| '1BAC' | '2BAC',
    image:string
    accountVerified: boolean
    provider:"local"| "google"
    completeProfile:boolean
}

interface typeAllData{
    data:typedata | null
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
            set({error:message,loading:false})
        }
    }
}))