import CalendrierDetailsDay from "@/components/CalendrierModal/Calendrier-Details-Day";
import CalendrierModal from "@/components/CalendrierModal/CalendrierModal";
import type { CalendrierInfo, EventApi } from "@/components/Layouts/components/right-sidebar/SidebarRight";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { Plus, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { getDefaultClassNames } from "react-day-picker";
import { fr } from "react-day-picker/locale";

const CalendrieMobile = () => {
      const apiUrl = import.meta.env.VITE_API_URL
      const [events, setEvents] = useState<CalendrierInfo[]>([]);
      const [openModalCalendrierDetail,setopenModalCalendrierDetail] = useState(false);
      const [SelectedInfo,setSelectedInfo]=useState<CalendrierInfo[]>([]);
      const [Open,setOpen]= useState(false);
      const defaultClassNames = getDefaultClassNames();
      useEffect(()=>{
      const handleGetEvents = async()=>{
        try{
          const res = await axios.get<{events:EventApi[]}>(`${apiUrl}/user/getEvenements`,{withCredentials:true});
          const parEvents:CalendrierInfo[] = res.data.events.map((e:EventApi)=>({
            date: new Date(e.Date),
            items: e.items.map((item)=>({
              type: item.type,
              titre: item.titre,
              Description: item.Description,
            }))
          }))
          setEvents(parEvents)       
        }catch(err){
          console.log(err);
        }
      }
      handleGetEvents()
    },[apiUrl]);
      const modifiers = {
    examen: events.filter(e => e.items.some(e => e.type === "Examen")).map(e => e.date),
    devoir: events.filter(e => e.items.some(e => e.type === "Devoir")).map(e => e.date),
    rappel: events.filter(e => e.items.some(e => e.type === "Rappel")).map(e => e.date),
    autre: events.filter(e => e.items.some(e => e.type === "Autre")).map(e => e.date),
    multi: events.filter(e => e.items.length > 1 ).map(e => e.date),
  };

  const modifiersStyles = {
    examen: { backgroundColor: "oklch(63.7% 0.237 25.331)", color: "white",borderRadius:"8px" },
    devoir: { backgroundColor: "oklch(76.9% 0.188 70.08)", color: "white" , borderRadius:"8px" },
    rappel: { backgroundColor: "oklch(69.6% 0.17 162.48)", color: "white" , borderRadius:"8px" },
    autre: { backgroundColor: "oklch(65.6% 0.241 354.308)", color: "white",borderRadius:"8px" },
    multi: { background: "purple", color: "white",borderRadius:"8px" },
  };

    const legendItems = [
    { label: "Aujourd'hui", type: "Aujourd'hui", color: "#F5F5F5" },
    { label: "Examens", type: "Examen", color: "oklch(63.7% 0.237 25.331)" },
    { label: "Devoirs", type: "Devoir", color: "oklch(76.9% 0.188 70.08)" },
    { label: "Rappels", type: "Rappel", color: "oklch(69.6% 0.17 162.48)" },
    { label: "Autre", type: "Autre", color: "oklch(65.6% 0.241 354.308)" },
    { label: "Plusieurs Evenements", type:"multi", color: "purple" }
  ];


  return (
    <>
    <div className="flex flex-col items-center lg:items-end gap-4 w-full h-full p-2">
  <Button
  onClick={()=>setOpen(true)}
    className="flex cursor-pointer items-center justify-center lg:justify-end text-xs sm:text-sm p-2 sm:p-3 rounded-md gap-2 bg-cyan-500 text-white hover:bg-cyan-600 w-full sm:w-auto"
  >
    <Plus size={16} />
    <span>Créer un événement</span>
  </Button>

  <div className="w-full max-w-md md:max-w-lg lg:max-w-full flex flex-col items-center gap-3">
    <div className="flex flex-wrap justify-center lg:justify-start gap-3 w-full">
      {legendItems.map((item, index) => (
        <span
          key={index}
          className="text-xs sm:text-sm flex items-center gap-1"
        >
          <Square size={14} fill={item.color} color={item.color} />
          {item.label}
        </span>
      ))}
    </div>
    <Calendar
            locale={fr}
            selected={events.map(e=>e.date)}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            classNames={{
              day_button: `${defaultClassNames.day_button} size-full day-button`
            }}
            className='p-2 size-full'
            onDayClick={(day) => {
              const eventClicked = events.filter(e => 
                e.date.toDateString() === day.toDateString()
              );
              if (eventClicked.length > 0) {
                setopenModalCalendrierDetail(true)
                setSelectedInfo(eventClicked)
              }
            }}
          />
  </div>
</div>
{openModalCalendrierDetail && (
      <CalendrierDetailsDay openModalCalendrierDetail={openModalCalendrierDetail} setopenModalCalendrierDetail={setopenModalCalendrierDetail} SelectedInfo={SelectedInfo}/>
)}
{Open && (
  <CalendrierModal open={Open} onOpenChange={setOpen}/>
)}
</>
  )
}

export default CalendrieMobile