
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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

const allMenuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['Admin', 'Manager', 'Accountant'],
  },
  {
    href: '/dashboard/financials',
    label: 'Financials',
    icon: Wallet,
    roles: ['Admin', 'Manager', 'Accountant'],
  },
  {
    href: '/dashboard/forecasting',
    label: 'Forecasting',
    icon: LineChart,
    roles: ['Admin', 'Manager'],
  },
  {
    href: '/dashboard/calendar',
    label: 'Calendar',
    icon: Calendar,
    roles: ['Admin', 'Manager'],
  },
  {
    href: '/dashboard/clients',
    label: 'Clients',
    icon: Users,
    roles: ['Admin', 'Manager'],
  },
   {
    href: '/dashboard/search',
    label: 'Search',
    icon: Search,
    roles: ['Admin', 'Manager', 'Accountant'],
  },
];

const secondaryMenuItems = [
    {
        href: '/dashboard/settings',
        label: 'Settings',
        icon: Settings,
        roles: ['Admin'],
    },
    {
        href: '/dashboard/support',
        label: 'Help & Support',
        icon: HelpCircle,
        roles: ['Admin', 'Manager', 'Accountant'],
    }
]

export function DashboardNav() {
  const pathname = usePathname();
  const { role } = useUser();
  const { setOpenMobile } = useSidebar();

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));
  const filteredSecondaryMenuItems = secondaryMenuItems.filter(item => item.roles.includes(role));
  
  const handleLinkClick = () => {
    //
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href} onClick={handleLinkClick}>
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
          {filteredSecondaryMenuItems.map((item) => (
              <SidebarMenuItem key={item.href} onClick={handleLinkClick}>
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
          ))}
        </SidebarMenu>
      </div>
    </nav>
  );
}
