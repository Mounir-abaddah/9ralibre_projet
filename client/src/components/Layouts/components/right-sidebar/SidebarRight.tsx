import CalendrierModal from '@/components/CalendrierModal/CalendrierModal';
import { Calendar } from '@/components/ui/calendar';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import {  Plus, Square } from 'lucide-react';
import { useState } from 'react';
import { fr } from "react-day-picker/locale"

const SidebarRight = () => {
    const [openModal,setOpenModal] = useState(false)
    const [examDates, setExamDates] = useState<Date[] | undefined>([
      new Date("2025-10-02"),
      new Date("2025-10-03")
    ]);

  return (
    <>
    <Sidebar collapsible='none' className='sticky top-0 hidden h-svh border-l lg:flex '>
      <SidebarHeader className='h-16 border-sidebar-border border-b'>
        <span>Header sidebar droite</span>
      </SidebarHeader>
      <SidebarContent className='w-full overflow-hidden'>
        <SidebarGroup className='w-full items-center p-2 non-interactive-calendar'>
          <Calendar mode='multiple' locale={fr} selected={examDates} onSelect={setExamDates}/>
        </SidebarGroup>
        <SidebarSeparator className='mx-0'/>
        <SidebarGroup>
          <SidebarGroupLabel>
            Légende des dates
          </SidebarGroupLabel>
          <span className='text-xs flex items-center gap-2'><Square size={14} fill='#F5F5F5' color='#F5F5F5'/>Date d'aujordhui</span>
          <span className='text-xs flex items-center gap-2'><Square size={14} fill='#FFC107' color='#FFC107'/>Date de vos examen </span>
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
    {openModal && (
      <CalendrierModal open={openModal} onOpenChange={setOpenModal}/>
    )}
    </>
  )
}

export default SidebarRight