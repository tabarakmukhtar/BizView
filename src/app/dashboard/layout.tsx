
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Briefcase } from 'lucide-react';
import { DashboardNav } from '@/components/dashboard-nav';
import { Header } from '@/components/header';
import { DataProvider } from '@/hooks/use-data';

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
            <div className="flex items-center gap-2 p-2">
              <Briefcase className="w-8 h-8 text-sidebar-primary" />
              <span className="text-xl font-semibold text-sidebar-foreground">BizView</span>
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
