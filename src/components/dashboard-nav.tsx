
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
} from 'lucide-react';

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
];

const secondaryMenuItems = [
    {
        href: '/dashboard/settings',
        label: 'Settings',
        icon: Settings,
    },
    {
        href: '/dashboard/support',
        label: 'Help & Support',
        icon: HelpCircle,
    }
]

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} asChild>
                <SidebarMenuButton
                  isActive={pathname === item.href}
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
          {secondaryMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} asChild>
                <SidebarMenuButton
                  isActive={pathname === item.href}
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
    </nav>
  );
}
