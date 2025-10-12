import { useProtectedRoutes } from '@/store/userStore'
import React, { useEffect, useState, type FormEvent } from 'react'
import type { ErrorType, FormDatatype } from './utils/type'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog'
import StepOneForm from './StepOneForm'
import StepTwoUpload from './StepTwoUpload'
import { Button } from '../ui/button'
import { validateForm } from './utils/validation'
import axios from 'axios'
import toast from 'react-hot-toast'
import NiveauxSelect from './NiveauxSelect'

const CompleteProfile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [step,setStep] = useState(0)
  const {data,fetchData} = useProtectedRoutes();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormDatatype>({
    nom: "",
    prenom: "",
    role: "",
    niveaux: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorType>({
    nom: "",
    prenom: "",
    role: "",
    niveaux: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(()=>{
    fetchData()
  },[fetchData])

  const handleChange = (field:string, value:string)=>{
    setFormData((prev)=>({...prev, [field]: value}));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  const handleFocus = (field:string)=>{
    setErrors((prev)=>({...prev,[field]:""}))
  }

  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(file){
      setAvatar(file)
    }
  }
  
  const handleSubmit = async(e:FormEvent)=>{
    e.preventDefault();
    if(!validateForm(formData,setErrors,step,data)) return;
    if(step === 0) return setStep(1);
    if(step === 1) return setStep(2);
    setLoading(true);
    try{
      const formDataToSend = new FormData();
            formDataToSend.append("nom", formData.nom);
            formDataToSend.append("prenom", formData.prenom);
            formDataToSend.append("role", formData.role);
            formDataToSend.append("niveaux", formData.niveaux);
            if(data?.provider === "google"){
              formDataToSend.append("password", formData.password);
            }
            
            if(avatar){
              formDataToSend.append("avatar", avatar)
            }
          const res = await axios.patch(`${apiUrl}/user/completeProfile`,formDataToSend,{withCredentials:true,headers:{
            "Content-Type":"multipart/form-data"
          }})
          if(res.data.success){
            toast.success('Profil complété avec succès !')
            window.location.reload()
          }
          }catch(err){
            if(axios.isAxiosError(err) && err.response){
              toast.error(err.response.data.message || "Erreur lors de l’envoi du profil")
            }
          }finally{
            setLoading(false)
          }
  }

  return (
     <Dialog open>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent>
        <style>{`[data-slot="dialog-close"] { display: none !important; }`}</style>
        <DialogHeader>
          <DialogTitle>Bienvenue ! 👋</DialogTitle>
          <DialogDescription>
            Veuillez compléter les informations suivantes pour une meilleure expérience.
          </DialogDescription>
        </DialogHeader>
        <DialogHeader className='flex flex-row items-center justify-between w-full'>
          <span className='text-lg font-bold flex items-center gap-2 border-b-2 border-sky-300 rounded-md'>
            {step === 0 ? "ℹ️ Informations personnelles" : step === 1 ? "📷 Importer votre photo" : "🎓 Niveau d’étude"}
          </span>
          <span>{step + 1} / 3</span>
        </DialogHeader>
        <form className='w-full flex flex-col gap-5 justify-around' onSubmit={handleSubmit}>
          <div>
            {step === 0 ? (
              <StepOneForm 
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onFocus={handleFocus}
                provider={data?.provider}
              />
            ):step === 1 ? (
              <StepTwoUpload 
                avatar={avatar} 
                onChange={handleFileChange} 
                onRemove={()=>setAvatar(null)}
              />
            ):(
              <NiveauxSelect 
                value={formData.niveaux} 
                onChange={(val)=>handleChange("niveaux", val)} 
                error={errors.niveaux}/>
            )
            } 
          </div>
          <div className="w-full flex gap-2 justify-end">
              {step > 0 && (
                <Button 
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  Précédent
                </Button>
              )}
              <Button type='submit' disabled={loading} className='cursor-pointer bg-amber-400 text-slate-700 hover:bg-amber-300'>
                {loading ? "Envoi..." : step === 0 ?  ("Suivant") : step === 1 ? ("Suivant")  : "Terminer"}
              </Button>
          </div>
        </form>
       </DialogContent> 
      </Dialog>
  )
}

export default CompleteProfile