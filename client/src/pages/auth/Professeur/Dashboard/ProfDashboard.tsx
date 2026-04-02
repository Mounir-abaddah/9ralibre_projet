import CardProf from "@/components/Dashboard/Card/CardProf";
import Chart from "@/components/Dashboard/Chart/Chart";
import { useProfProtectedRoutes } from "@/store/userStore";
import { useEffect, useState } from "react";
import ChatProf from "@/components/Dashboard/ChatProf/ChatProf";
import axios from "axios";
import Activite from "@/components/Dashboard/Activite/Activite";

const ProfDashboard = () => {
  document.title = "Dashboard | 9ralibre";

  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, fetchData } = useProfProtectedRoutes();

  const [message, setMessage] = useState([]);
  const [activities, setActivities] = useState([]);

  const date = new Date();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const getMessage = async () => {
      const res = await axios.get(`${apiUrl}/prof/last-messages`, {
        withCredentials: true,
      });
      setMessage(res.data.messages);
    };
    getMessage();
  }, []);

  useEffect(() => {
    const getActivities = async () => {
      const res = await axios.get(`${apiUrl}/prof/recent-activity`, {
        withCredentials: true,
      });
      setActivities(res.data.activities);
    };
    getActivities();
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Bonjour, {data?.nom} 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Voici un résumé de votre activité
          </p>
        </div>

        <div className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-medium text-white shadow">
          {date.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* STATS */}
      <CardProf data={data} />

      {/* GRID */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Chart />
        </div>
        <ChatProf messages={message} />
      </div>

      {/* ACTIVITE */}
      <Activite activities={activities} />
    </div>
  );
};

export default ProfDashboard;