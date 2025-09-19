import Input from '@/components/Form/Input';
import Loadering from '@/components/Loadering/Loadering';
import axios from 'axios';
import React, { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ralibre_logo from '@/assets/images/9ralibre.png';

const ModificationMotdepasse = () => {
  const {token} = useParams()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading,setLoading] = useState<boolean>(false)
  const [password,setpassword] = useState<string>("");
  const [errPassword,seterrPassword] = useState<string>("")
  
  const handleSubmit = async(e:FormEvent)=>{
    e.preventDefault();
     const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    let Valid = true;
    setLoading(true)

    if (!password.trim() || !passwordRegex.test(password)) {
  seterrPassword(
    "Le mot de passe doit contenir au minimum 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial."
  );
  Valid = false;
} else {
  seterrPassword("");
}


    if(!Valid){
      setLoading(false);
      return;
    }

    try{
      const response = await axios.put(`${apiUrl}/auth/resetPassword/${token}`,{password})
      if(response.data.success){
        toast.success(response.data.message)
        navigate('/connexion')
      }
    }catch(err){
      if(axios.isAxiosError(err) && err.response){
        seterrPassword(err.response.data.message)
      }
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className='mx-auto max-w-xl'> 
    <header>
        <img src={ralibre_logo} alt="9ralibre_logo" width={200} />
      </header>
      <div className="py-4 px-6 text-center rounded-t-lg bg-gray-100">
            <h2 className="flex items-center justify-center font-semibold text-xl mb-0 text-[#3F3F3F]">
              <span>Nouveau mot de passe</span>
            </h2>
      </div>
      <div className='p-8 bg-white'>
         <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <Input 
            id='password'
            label='Nouveaux mot de passe'
            placeholder='Tapez votre nouveaux mot de passe'
            type='password'
            value={password}
            onFocus={()=>seterrPassword("")}
            onChange={setpassword}
            icon='lock'
            error={errPassword}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded-md flex gap-2 items-center justify-center w-full
            ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-500 cursor-pointer'}`}
        >
          {loading && <Loadering />}
          <span className="text-[#3f3f3f]">Réinitialiser le mot de passe</span>
      </button>
      </form>
      <hr className='my-8'/>
      <div className='text-right '>
        <Link to={'/'} className='border-b-sky-400 border-b'>Retour au site</Link>
      </div>
      </div>
    </div>
  )
}

export default ModificationMotdepasse