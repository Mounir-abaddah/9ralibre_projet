import React from 'react'
import {SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Layouts/components/app-sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import SidebarRight from '@/components/Layouts/components/right-sidebar/SidebarRight'
import { BellRing, Brush, Calendar1 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

const Layouts = ({children} : {children:React.ReactNode}) => {
  const {niveaux} = useParams()
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="flex h-16 w-full shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className='flex w-full items-center justify-between'>
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
              
              <BreadcrumbList className='flex w-1/3 items-center justify-end '>
                <BreadcrumbItem className="cursor-pointer">
                  <Link to={`/Calendrier/${niveaux}`}>
                    <Calendar1 size={19}/>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link to={`/Drawing/${niveaux}`}className='cursor-pointer'>
                    <Brush size={19}/>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbItem className='cursor-pointer'>
                    <BellRing size={19}/>
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