import CalendrierDetailsDay from '@/components/CalendrierModal/Calendrier-Details-Day';
import CalendrierModal from '@/components/CalendrierModal/CalendrierModal';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import axios from 'axios';
import {  Plus, Square } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { fr } from "react-day-picker/locale"


interface Item {
  type: string;
  titre: string;
  Description?: string;
}

interface EventApi {
  Date:string;
  items:[Item]
}
export interface CalendrierInfo {
  date:Date;
  items:Item[]
}


const SidebarRight = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [openModal,setOpenModal] = useState(false);
    const [openModalCalendrierDetail,setopenModalCalendrierDetail] = useState(false)
    const [events, setEvents] = useState<CalendrierInfo[]>([]);
    const [SelectedInfo,setSelectedInfo]=useState<CalendrierInfo[]>([]);
    const [checkedTypes, setCheckedTypes] = useState<string[]>([]);


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

  const handleCheckedValue = (type:string , checked:boolean)=>{
      setCheckedTypes(prev => checked ? [...prev,type] : prev.filter(e=>e!==type))
  }
const filteredEvents = checkedTypes.length > 0
  ? events.filter(e => 
      checkedTypes.includes("multi")
        ? e.items.length > 1 || checkedTypes.some(t => e.items.some(item => item.type === t))
        : e.items.some(item => checkedTypes.includes(item.type))
    )
  : events;

  const modifiers = {
    examen: filteredEvents.filter(e => e.items.some(e => e.type === "Examen")).map(e => e.date),
    devoir: filteredEvents.filter(e => e.items.some(e => e.type === "Devoir")).map(e => e.date),
    rappel: filteredEvents.filter(e => e.items.some(e => e.type === "Rappel")).map(e => e.date),
    autre: filteredEvents.filter(e => e.items.some(e => e.type === "Autre")).map(e => e.date),
    multi: filteredEvents.filter(e => e.items.length > 1 ).map(e => e.date),
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
    <Sidebar collapsible='none' className='sticky top-0 hidden h-svh border-l lg:flex '>
      <SidebarHeader className='h-16 border-sidebar-border border-b'>
        <span>Header sidebar droite</span>
      </SidebarHeader>
      <SidebarContent className='w-full overflow-x-hidden'>
        <SidebarGroup className='w-full flex gap-3 items-center p-2 '>
          <Calendar
            locale={fr}
            selected={filteredEvents.map(e=>e.date)}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            classNames={{
              day_button: "day-button"
            }}
            className='p-2'
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
          <SidebarGroupLabel>
            Légende des dates
          </SidebarGroupLabel>
          <div className='w-full flex justify-center flex-wrap gap-3 p-2'>
            {legendItems.map((item,index)=>(
            <span key={index} className='text-xs flex flex-row'>
              <Square size={14} fill={item.color} color={item.color} />
              {item.label}
            </span>
          ))}  
          </div>
        </SidebarGroup>
        <SidebarSeparator className='mx-0'/>
        <SidebarGroup>
          <div className='flex flex-col  items-start gap-2'>
            {legendItems.filter(item => item.label != "Aujourd'hui")
            .map((item,index)=>(
              <span key={index} className='flex gap-2'>
                <Checkbox onCheckedChange={(checked)=>handleCheckedValue(item.type,!!checked)} style={{"--color":item.color} as CSSProperties} className={`data-[state=checked]:bg-[var(--color)] data-[state=checked]:outline-0 data-[state=checked]:border-0`}/>
                <Label id={item.label} className='text-xs'>{item.label}</Label>
              </span>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={()=>setOpenModal(true)} className='flex w-full active:bg-cyan-200 bg-cyan-500 text-white hover:bg-cyan-600 hover:text-white cursor-pointer transition ease all duration-200'>
              <Plus strokeWidth={2}/>
              <span className='text-xs'>Créer un événement</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    {openModalCalendrierDetail && (
      <CalendrierDetailsDay openModalCalendrierDetail={openModalCalendrierDetail} setopenModalCalendrierDetail={setopenModalCalendrierDetail} SelectedInfo={SelectedInfo}/>
    )}
    {openModal && (
      <CalendrierModal open={openModal} onOpenChange={setOpenModal}/>
    )}
    </>
  )
}

export default SidebarRight