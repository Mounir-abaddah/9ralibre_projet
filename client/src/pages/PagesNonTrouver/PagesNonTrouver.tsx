import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import animationData from "@/assets/lottlie/404.json";
import { useProtectedRoutes } from '@/store/userStore';

const PagesNonTrouver:React.FC = () => {
    const navigate = useNavigate();
    const {data,fetchData,loading} = useProtectedRoutes()
    
    useEffect(()=>{
        fetchData()
    },[fetchData]);

    const handleClick = ()=>{
        if (loading) return;
        navigate(data ? '/Dashboard' : '/');
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className="text-4xl font-bold mt-6 text-gray-800">Page Non Trouvée</h1>
      <p className="text-gray-600 mt-2 text-center">
        Désolé, la page que vous cherchez n'existe pas.
      </p>

        <button
        onClick={handleClick}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-300 to-yellow-400 text-white font-semibold rounded-md shadow cursor-pointer transition"
      >
        {data ? 'Retour à Dashbord' : `Retour à l'accueil`}
      </button>
       
    </div>

  )
}

export default PagesNonTrouver