import React from 'react'
import {SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Layouts/components/app-sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import SidebarRight from '@/components/Layouts/components/right-sidebar/SidebarRight'
import { Brush, Calendar1 } from 'lucide-react'
import { Link } from 'react-router-dom'

const Layouts = ({children} : {children:React.ReactNode}) => {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="w-full border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className='flex w-full justify-between items-center'>
              <BreadcrumbList className='w-full'>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
              
              <BreadcrumbList className='w-1/4 lg:w-auto flex justify-end items-center '>
                <BreadcrumbItem className="lg:hidden block">
                  <Link to="/Calendrier">
                    <Calendar1 size={19}/>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link to="/Drawing">
                    <Brush size={19}/>
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <section className="flex flex-1 flex-col gap-4 p-4">
            {children}
        </section>
        </SidebarInset>
        <SidebarRight />
    </SidebarProvider>
  )
}

export default Layouts