import CardProf from "@/components/Dashboard/Card/CardProf";
import Chart from "@/components/Dashboard/Chart/Chart";
import { useProfProtectedRoutes } from "@/store/userStore"
import { useEffect } from "react";
import ChatProf from "@/components/Dashboard/ChatProf/ChatProf";

const ProfDashboard = () => {
  document.title = "Dashboard | 9ralibre"
  const {data,fetchData} = useProfProtectedRoutes();
  const date = new Date();
  
  useEffect(()=>{
  fetchData();
  },[fetchData]);


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
      <div className="space-y-6">
        <CardProf data={data}/>
        <div className="flex w-full items-start space-x-2">
          <Chart />
          <ChatProf />
        </div>
      </div>
    </div>
  )
}

export default ProfDashboard