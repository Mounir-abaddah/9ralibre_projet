import CardProf from "@/components/Dashboard/Card/CardProf";
import Chart from "@/components/Dashboard/Chart/Chart";
import { useProfProtectedRoutes } from "@/store/userStore"
import { useEffect, useState } from "react";
import ChatProf from "@/components/Dashboard/ChatProf/ChatProf";
import axios from "axios";
import Activite from "@/components/Dashboard/Activite/Activite";

const ProfDashboard = () => {
  document.title = "Dashboard | 9ralibre"
  const apiUrl = import.meta.env.VITE_API_URL;
  const {data,fetchData} = useProfProtectedRoutes();
  const date = new Date();
  const [message,setMessage] = useState([]);
  const [activities,setActivities] = useState([])

  useEffect(()=>{
  fetchData();
  },[fetchData]);

  useEffect(()=>{
    const getMessage = async()=>{
      const res = await axios.get(`${apiUrl}/prof/last-messages`,{withCredentials:true});
      setMessage(res.data.messages)
    }
    getMessage();
  },[]);
  
  useEffect(()=>{
    const getActivities = async ()=>{
      const res = await axios.get(`${apiUrl}/prof/recent-activity`,{
        withCredentials:true
      })
      setActivities(res.data.activities)
    }
  getActivities()
  },[])


  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <span className="text-base font-semibold">Bonjour, {data?.nom}</span>
          <span className="text-sm font-light">Voici un résumé de votre activité aujourd'hui</span>
        </div>
        <div>
          <span className="rounded-md bg-gray-600 p-2 text-xs shadow-md">
            {date.toLocaleDateString("Fr-fr",{
              "weekday":"long",
              "year":"numeric",
              "month":"long",
              "day":"numeric"
            })}
          </span>
        </div>
      </div>
      <div className="w-full space-y-6">
        <CardProf data={data}/>
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <Chart />
          <ChatProf messages={message} />
        </div>
        <Activite activities={activities}/>
      </div>
    </div>
  )
}

export default ProfDashboard