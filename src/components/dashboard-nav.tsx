
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Calendar,
  Users,
  Settings,
  HelpCircle,
  Search,
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/financials',
    label: 'Financials',
    icon: Wallet,
  },
  {
    href: '/dashboard/forecasting',
    label: 'Forecasting',
    icon: LineChart,
  },
  {
    href: '/dashboard/calendar',
    label: 'Calendar',
    icon: Calendar,
  },
  {
    href: '/dashboard/clients',
    label: 'Clients',
    icon: Users,
  },
   {
    href: '/dashboard/search',
    label: 'Search',
    icon: Search,
  },
];

const secondaryMenuItems = [
    {
        href: '/dashboard/settings',
        label: 'Settings',
        icon: Settings,
        roles: ['Manager', 'Admin'],
    },
    {
        href: '/dashboard/support',
        label: 'Help & Support',
        icon: HelpCircle,
    }
]

export function DashboardNav() {
  const pathname = usePathname();
  const { role } = useUser();

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href === '/dashboard/search' && pathname.startsWith('/dashboard/search'))}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
      <div className="mt-auto">
        <SidebarMenu>
          {secondaryMenuItems.map((item) => {
            if (item.roles && !item.roles.includes(role)) {
              return null;
            }
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>
    </nav>
  );
}
