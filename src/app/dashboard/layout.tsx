
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Briefcase, PanelLeft } from 'lucide-react';
import { DashboardNav } from '@/components/dashboard-nav';
import { Header } from '@/components/header';
import { DataProvider } from '@/hooks/use-data';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

function CustomSidebarTrigger() {
    const { toggleSidebar } = useSidebar();
    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => toggleSidebar()}
            >
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <SidebarProvider>
        <Sidebar side="left" collapsible="icon" variant="sidebar">
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-sidebar-primary" />
                <span className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">BizView</span>
              </div>
               <div className="group-data-[collapsible=icon]:hidden">
                 <CustomSidebarTrigger />
               </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>
        <SidebarRail />
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  );
}
