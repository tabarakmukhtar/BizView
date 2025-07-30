
'use client';

import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsClient } from '@/hooks/use-is-client';

type UserRole = 'Manager' | 'Admin' | 'Accountant' | 'Guest';

const profileDetails: Record<UserRole, { email: string, title: string }> = {
  Manager: {
    email: 'manager@bizview.com',
    title: 'Senior Business Manager',
  },
  Admin: {
    email: 'admin@bizview.com',
    title: 'System Administrator',
  },
  Accountant: {
    email: 'accountant@bizview.com',
    title: 'Financial Accountant',
  },
  Guest: {
    email: 'guest@bizview.com',
    title: 'Guest User',
  }
}

export default function ProfilePage() {
  const { role: currentUserRole } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Guest');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('https://placehold.co/100x100');
  const isClient = useIsClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set the initial role to the current user's role once the component mounts
    if (isClient && currentUserRole && currentUserRole !== 'Guest') {
      setSelectedRole(currentUserRole);
    }
  }, [currentUserRole, isClient]);
  
  const isAdmin = isClient && currentUserRole === 'Admin';

  // This effect runs when `selectedRole` changes, loading the correct user data.
  useEffect(() => {
    if (selectedRole && selectedRole !== 'Guest' && isClient) {
      const savedAvatar = localStorage.getItem(`user-avatar-${selectedRole}`);
      const savedName = localStorage.getItem(`user-name-${selectedRole}`);
      const savedEmail = localStorage.getItem(`user-email-${selectedRole}`);
      const savedTitle = localStorage.getItem(`user-title-${selectedRole}`);
      
      const defaultName = profileDetails[selectedRole] ? `The ${selectedRole}` : 'User';

      setAvatarPreview(savedAvatar || 'https://placehold.co/100x100');
      setName(savedName || defaultName);
      setEmail(savedEmail || profileDetails[selectedRole]?.email || '');
      setTitle(savedTitle || profileDetails[selectedRole]?.title || '');
    }
  }, [selectedRole, isClient]);


  const handleSaveChanges = () => {
    if (selectedRole && selectedRole !== 'Guest') {
      localStorage.setItem(`user-avatar-${selectedRole}`, avatarPreview);
      localStorage.setItem(`user-name-${selectedRole}`, name);
      localStorage.setItem(`user-email-${selectedRole}`, email);
      localStorage.setItem(`user-title-${selectedRole}`, title);
      
      // If the admin edits their own profile, trigger a real-time update in the header
      if (selectedRole === currentUserRole) {
        window.dispatchEvent(new CustomEvent('storage', { detail: { key: `user-avatar-${currentUserRole}` }}));
        window.dispatchEvent(new CustomEvent('storage', { detail: { key: `user-name-${currentUserRole}` }}));
      }

      toast({
        title: 'Profile Updated',
        description: `Changes for ${selectedRole} have been saved successfully.`,
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isClient) {
    return (
       <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-7 w-32 mb-1" />
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-48 mx-auto" />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-32 mb-1" />
                    <Skeleton className="h-5 w-56" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex items-center gap-4">
                           <Skeleton className="h-10 w-36" />
                           <Skeleton className="h-5 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={avatarPreview} alt={name} data-ai-hint="person" />
              <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">{title}</p>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
                {isAdmin ? "Select a user to update their information." : "Your profile is managed by an administrator."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="role-select">Select User to Edit</Label>
                 <Select onValueChange={(value) => setSelectedRole(value as UserRole)} value={selectedRole}>
                    <SelectTrigger id="role-select">
                      <SelectValue placeholder="Select a role to edit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isAdmin}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!isAdmin}/>
            </div>
            <div className="space-y-2">
               <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                    <Input
                        id="picture"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                        disabled={!isAdmin}
                    />
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className='inline-block'>
                            <Button variant="outline" onClick={handleUploadClick} disabled={!isAdmin}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Picture
                            </Button>
                          </div>
                        </TooltipTrigger>
                         {!isAdmin && (
                          <TooltipContent>
                            <p>Only Admins can change profile pictures.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB.</p>
                </div>
            </div>
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button onClick={handleSaveChanges} disabled={!isAdmin}>Save Changes</Button>
                  </div>
                </TooltipTrigger>
                 {!isAdmin && (
                  <TooltipContent>
                    <p>Only Admins can save changes.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
