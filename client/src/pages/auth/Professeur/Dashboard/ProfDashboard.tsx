/* eslint-disable tailwindcss/no-custom-classname */
import CardProf from "@/components/Dashboard/Card/CardProf";
import { useProfProtectedRoutes } from "@/store/userStore";
import { useEffect, useState } from "react";
import ChatProf from "@/components/Dashboard/ChatProf/ChatProf";
import axios from "axios";
import Activite from "@/components/Dashboard/Activite/Activite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import img_professeur_dash from '@/assets/images/Professor-cuate.png'
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import Chart from "@/components/Dashboard/Chart/Chart";


interface CalendarItem {
  type: string;
  titre: string;
  Description?: string;
}

interface CalendarEvent {
  _id: string;
  Date: string;
  items: CalendarItem[];
}


const ProfDashboard = () => {
  document.title = "Dashboard | 9ralibre";
  const dateToday = new Date()
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, fetchData } = useProfProtectedRoutes();
  const [message, setMessage] = useState([]);
  const [activities, setActivities] = useState([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  

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


  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/user/getEvenements`, {
        withCredentials: true,
      });
      setEvents(res.data?.events || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    fetchEvents();
  },[])

  


    const eventDates = events.map((event) => new Date(event.Date));
    const nextEvents = events.flatMap((event) =>(event.items || []).map((item) => ({
        date: new Date(event.Date),
        ...item,
      })),
    ).sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  return (
    /* Layout principal responsive */
  <div className="space-y-4 p-2 md:p-4">
    {/* HEADER */}
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">
          Bonjour, {data?.nom} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Voici un résumé de votre activité
        </p>
      </div>

      <div className="w-fit rounded-xl bg-cyan-500 px-4 py-2 text-xs font-medium text-white shadow md:text-sm">
        {dateToday?.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2.4fr_1fr]">
      
      {/* LEFT SECTION */}
      <div className="space-y-4">
        {/* HERO CARD */}
        <Card className="flex flex-col-reverse items-center justify-between overflow-hidden rounded-2xl border p-4 shadow-sm sm:flex-row">
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h1 className="text-lg leading-snug font-semibold sm:text-xl md:text-2xl">
              Votre parcours commence ici
            </h1>

            <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
              Gérez facilement vos cours, suivez les progrès de vos élèves,
              publiez du contenu éducatif et optimisez votre enseignement
              grâce à un tableau de bord conçu pour accompagner votre réussite pédagogique.
            </p>
          </div>

          <div className="mb-3 flex flex-shrink-0 justify-center sm:mb-0 sm:ml-4">
            <img
              src={img_professeur_dash}
              alt="Dashboard professeur"
              loading="lazy"
              className="h-auto w-28 object-contain sm:w-36 md:w-44 lg:w-52"
            />
          </div>
        </Card>

        {/* STATS */}
        <CardProf data={data} />

        {/* CHART + ACTIVITES */}
        <div className="space-y-4">
          <Chart />
          <Activite activities={activities} />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="space-y-4"> 
        {/* CALENDAR */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Calendrier</span>

              <Button
                variant="ghost"
                className="justify-start text-xs text-amber-500 hover:text-amber-600 sm:justify-end"
              >
                Ajouter un événement
                <MoveUpRight size={16} />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{ hasEvent: eventDates }}
              locale={fr}
              modifiersClassNames={{
                hasEvent: "bg-amber-100 text-amber-900 font-semibold",
              }}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </CardContent>

          <CardContent className="pt-0">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Prochains événements
            </p>

            {nextEvents.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aucun événement planifié
              </p>
            ) : (
              <ul className="space-y-2">
                {nextEvents.map((event, index) => (
                  <li
                    key={`${event.titre}-${index}`}
                    className="rounded-md border border-slate-200 px-3 py-2 text-xs sm:text-sm dark:border-slate-700"
                  >
                    <span className="font-medium">
                      {event.date.toLocaleDateString("fr-FR")}
                    </span>{" "}
                    - {event.type}: {event.titre}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* CHAT */}
        <ChatProf messages={message} />
      </div>
    </div>
  </div>
  );
};

export default ProfDashboard;