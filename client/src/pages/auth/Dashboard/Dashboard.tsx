import CompleteProfile from "@/components/CompleteProfile/CompleteProfile";
import Layouts from "@/components/Layouts/Layouts"
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



  return (
      <Layouts>
        {data?.completeProfile
          ?
          <h1>{niveaux}</h1>
          :
          <CompleteProfile />
        }
      </Layouts>
  )
}

export default Dashboard