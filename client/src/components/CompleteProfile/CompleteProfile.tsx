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
import { useTranslation } from 'react-i18next'

const CompleteProfile = () => {
  const { t } = useTranslation();
  document.title = t('completeProfile.pageTitle');
  const apiUrl = import.meta.env.VITE_API_URL;
  const [step,setStep] = useState(0)
  const {fetchData} = useProtectedRoutes();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormDatatype>({
    nom: "",
    prenom: "",
    role: "",
    niveaux: "",
  });

  const [errors, setErrors] = useState<ErrorType>({
    nom: "",
    prenom: "",
    role: "",
    niveaux: "",
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
    if(!validateForm(formData,setErrors,step,t)) return;
    if(step === 0) return setStep(1);
    if(step === 1) return setStep(2);
    setLoading(true);
    try{
      const formDataToSend = new FormData();
            formDataToSend.append("nom", formData.nom);
            formDataToSend.append("prenom", formData.prenom);
            formDataToSend.append("role", formData.role);
            formDataToSend.append("niveaux", formData.niveaux);
            if(avatar){
              formDataToSend.append("avatar", avatar)
            }
          const res = await axios.patch(`${apiUrl}/user/completeProfile`,formDataToSend,{withCredentials:true,headers:{
            "Content-Type":"multipart/form-data"
          }})
            if(res.data.success){
              toast.success(t("completeProfile.toast.success"));
              await fetchData();
              const user = res.data.user
              window.location.href = `/Dashboard/${user.niveaux}`
            }
          }catch(err){
            if(axios.isAxiosError(err) && err.response){
              toast.error(err.response.data.message || t("completeProfile.toast.error"))
            }
          }finally{
            setLoading(false)
          }
  }

  return (
     <Dialog open>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="max-w-3xl w-full">
        <style>{`[data-slot="dialog-close"] { display: none !important; }`}</style>
        <DialogHeader>
          <DialogTitle>{t("completeProfile.welcomeTitle")}</DialogTitle>
          <DialogDescription>
            {t("completeProfile.welcomeDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <span className='flex items-center gap-2 rounded-md border-b-2 border-sky-300 text-lg font-bold'>
            {step === 0 ? t("completeProfile.steps.personalInfo") : step === 1 ? t("completeProfile.steps.uploadPhoto") : t("completeProfile.steps.studyLevel")}
          </span>
          <span className='text-sm text-slate-500 dark:text-slate-400'>
            {t("completeProfile.stepCount", { current: step + 1, total: 3 })}
          </span>
        </DialogHeader>
        <form className='flex w-full flex-col justify-around gap-5' onSubmit={handleSubmit}>
          <div>
            {step === 0 ? (
              <StepOneForm 
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onFocus={handleFocus}
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
          <div className="flex w-full justify-end gap-2">
              {step > 0 && (
                <Button 
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  {t("completeProfile.buttons.previous")}
                </Button>
              )}
              <Button type='submit' disabled={loading} className='cursor-pointer bg-amber-400 text-slate-700 hover:bg-amber-300'>
                {loading ? t("completeProfile.buttons.sending") : step === 2 ? t("completeProfile.buttons.finish") : t("completeProfile.buttons.next")}
              </Button>
          </div>
        </form>
      </DialogContent> 
      </Dialog>
  )
}

export default CompleteProfile