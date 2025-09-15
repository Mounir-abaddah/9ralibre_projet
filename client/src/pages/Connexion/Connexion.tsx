import React, { useState } from 'react'
import img_login from '@/assets/images/connexion/Thesis-pana.png'
import logo from '@/assets/images/logo.png';

import Googles from '@/components/Oauth/Google';
import Microsofts from '@/components/Oauth/Microsoft';
import { LogIn } from 'lucide-react';
import Loadering from '@/components/Loadering/Loadering';
import Input from '@/components/Form/Input';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Connexion = () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const navigate = useNavigate()
        const [Loading,setLoading] = useState<boolean>(false);
        
        const [email,setEmail] = useState<string>("");
        const [ErrEmail,setErrEmail] = useState<string>("");
        const [password,setPassword] = useState<string>("");
        const [ErrPassword,setErrPassword] = useState<string>("");

        const handleForm = async()=>{
            let Valid = true
            const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            setLoading(true)

            if(!email.trim() ||!regexEmail.test(email)){
                setErrEmail("Email invalide")
                Valid=false
            }else{
                setErrEmail("")
            }
            if(!passwordRegex.test(password)){
                setErrPassword("Minimum huit caractères, une majuscule, une minuscule, un chiffre et un caractère spécial");
                Valid = false
            }else{
                setErrPassword("")
            }
            if(!Valid){
                setLoading(false);
                return
            }
            try{
                const response = await axios.post(`${apiUrl}/auth/connexion`,{
                    email,
                    password
                },{withCredentials:true})

                if(response.data.success){
                    toast.success(response.data.message)
                    navigate('/Dashboard')
                }
            }catch(err){
                if(axios.isAxiosError(err) && err.response) {
                    toast.error(err.response.data.message);
                    setErrPassword("Email ou mot de passe incorrect")
                    setErrEmail("Email ou mot de passe incorrect");
                }
            }
            setLoading(false);
        }
  return (
<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className='flex items-center gap-2 justify-around w-full h-screen md:h-screen p-4'>
            <div className='w-full lg:block hidden'>
                <img src={img_login} alt="logo_inscription" width={700} height={700}/>
            </div>
            <div className='relative flex items-start gap-3 flex-col w-full shadow-xl p-5 rounded-md bg-amber-50'>
                <img src={logo} alt="logo_de_site" width={50} className='absolute right-0 -top-3 rotate-6'/>
                <div className='w-full'>
                    <h2 className='text-3xl font-medium'>Commençons <br />à apprendre avec <span className='text-amber-500 font-semibold'>9ral<span className='text-sky-500'>ibre</span></span></h2>
                    <p className='text-sm'>Veuillez vous se connecter ou s'inscrire pour continuer</p>
                </div>
                <div className='flex flex-col items-center gap-3 w-full'>
                <div className='flex items-start flex-col gap-1 w-full'>
                    <Input
                        placeholder='e.g@email.ma' 
                        label='Email' 
                        id='monEmail'
                        value={email}
                        type='email'
                        onChange={setEmail} 
                        onFocus={()=>setErrEmail("")}
                        icon='mail' 
                        error={ErrEmail}
                    />
                </div>
                <div className='flex items-start flex-col gap-1 w-full'>
                    <Input
                        placeholder='Votre Mot de passe' 
                        label='Mot de passe' 
                        id='password' 
                        value={password}
                        type='password'
                        onChange={setPassword} 
                        onFocus={()=>setErrPassword("")}
                        icon='lock' 
                        error={ErrPassword}
                    />
                </div>
                <div className='flex items-end justify-end w-full'>
                    <p>
                        <Link to={'/forgot-password'} className='text-sky-500 font-semibold border-b border-sky-200 hover:text-blue-400 transition-all duration-400'>Mot de passe oublié ?</Link>
                    </p>
                </div>
                <button onClick={handleForm} disabled={Loading} className='disabled:bg-slate-50 disabled:shadow w-full flex items-center justify-center gap-2 bg-amber-300 rounded-md hover:bg-amber-400 cursor-pointer text-black dark:text-white p-3 font-semibold text-base hover:shadow-md transition-all duration-300'>
                    {Loading ? <Loadering  /> : '' }
                    <h2>Connectez-vous</h2>
                    <LogIn />
                </button>
                <div className='flex items-center justify-center w-full'>
                    <p>
                        Pas encore de compte ? <Link to={'/inscription'} className='text-blue-200 border-b border-sky-200 hover:text-blue-400 transition-all duration-400'>inscrivez-vous</Link>
                    </p>
                </div>
                <div className='flex items-center justify-around w-full gap-4'>
                    <hr className='w-full'/>
                    <h6 className='font-semibold'>OU</h6>
                    <hr className='w-full'/>
                </div>
                <div className='flex flex-wrap gap-4 items-center justify-around w-full'>
                    <Googles text={`Se connecter avec Google`}/>
                    <Microsofts text={`Se connecter avec Miscrosoft`}/>
                </div>
            </div>
        </div>
 </div>
 </div>
  )
}

export default Connexion