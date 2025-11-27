import PagesNonTrouver from "@/pages/PagesNonTrouver/PagesNonTrouver";
import { useProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  document.title = 'Dashboard | 9ralibre'
  const {niveaux} = useParams()
  const {data,fetchData} = useProtectedRoutes(); 

    useEffect(()=>{
    fetchData()
  },[fetchData]);

  const enumParams = ['1AC','2AC','3AC','TC','1BAC','2BAC'];

  if(!enumParams.includes(niveaux || '')){
    return <PagesNonTrouver />
  }

  const isEtudiant = data?.role === "Etudiant";
  const borderColor = isEtudiant ? "border-b-sky-400" : "border-pink-400";


  return (
      <div className="w-full">
          <h1 className="text-xs">
            Bonjours,<span className={`border-b-2 ${borderColor}`}>{data?.nom} {data?.prenom}</span>
          </h1>  
      </div>
  )
}

export default Dashboard