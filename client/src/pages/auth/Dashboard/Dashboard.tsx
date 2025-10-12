import CompleteProfile from "@/components/CompleteProfile/CompleteProfile";
import Layouts from "@/components/Layouts/Layouts"
import { useProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react";

const Dashboard = () => {
  const {data,fetchData} = useProtectedRoutes();  
  useEffect(()=>{
    fetchData()
  },[fetchData])
  document.title = 'Dashboard | 9ralibre'
  return (
      <Layouts>
        {data?.completeProfile
          ?
          <h1>ffff</h1>
          :
          <CompleteProfile />
        }
      </Layouts>
  )
}

export default Dashboard