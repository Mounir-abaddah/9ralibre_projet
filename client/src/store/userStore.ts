import axios from 'axios';
import { create } from 'zustand';

interface typedata{
    id: string,
    nom: string,
    prenom: string,
    email: string,
    role: string,
    accountVerified: boolean
}

interface typeAllData{
    data:typedata
    loading:boolean
    error:string | null
    fetchData:()=>Promise<void>
}

export const useProtectedRoutes = create<typeAllData>()((set)=>({
    data:{
        id:"",
        nom:"",
        prenom:"",
        email:"",
        role:"",
        accountVerified:true
    },
    loading:true,
    error:null,
    fetchData:async()=>{
        try{
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/user/profile`,{withCredentials:true});
            set({data:response.data.user,loading:false,error:null})
        }catch{
            set({error:"Une erreure est survenue",loading:false})
        }
    }
}))