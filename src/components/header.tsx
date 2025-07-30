
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell, LifeBuoy, LogOut, User, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useUser } from '@/hooks/use-user';

const notifications = [
  {
    title: 'New client signed!',
    description: 'Acme Inc. has joined your portfolio.',
  },
  {
    title: 'Invoice Paid',
    description: 'Your invoice #INV-1234 has been paid.',
  },
  {
    title: 'Project Update',
    description: 'A new comment was added to the website redesign project.',
  },
];


export function Header() {
  const router = useRouter();
  const { name, role } = useUser();
  const [avatarUrl, setAvatarUrl] = useState('https://placehold.co/40x40');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateAvatar = (event?: StorageEvent | CustomEvent) => {
      if (role && role !== 'Guest') {
        const key = `user-avatar-${role}`;
         // Check if the event is for the correct key or if there's no event (initial load)
        if (!event || (event instanceof CustomEvent && event.detail.key === key) || (event instanceof StorageEvent && event.key === key)) {
          const savedAvatar = localStorage.getItem(key);
          setAvatarUrl(savedAvatar || 'https://placehold.co/40x40');
        }
      } else {
        setAvatarUrl('https://placehold.co/40x40');
      }
    };

    updateAvatar();

    window.addEventListener('storage', updateAvatar);
    
    // Listen for custom event from profile page
    const customUpdateListener = (event: Event) => updateAvatar(event as CustomEvent);
    window.addEventListener('storage', customUpdateListener);


    return () => {
      window.removeEventListener('storage', updateAvatar);
      window.removeEventListener('storage', customUpdateListener);
    };
  }, [role]);

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-9 md:w-[300px] lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
                <Card className='border-0 shadow-none'>
                    <CardHeader className='p-2'>
                        <CardTitle className='text-base'>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className='p-2'>
                        <div className="flex flex-col gap-4">
                            {notifications.map((notification, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="mt-1 flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {notification.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatarUrl} alt="@manager" data-ai-hint="person" />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
             {(role === 'Manager' || role === 'Admin') && (
              <DropdownMenuItem asChild>
                 <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
               <Link href="/dashboard/support">
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
