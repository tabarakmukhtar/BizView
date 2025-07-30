
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

const profileDetails: Record<string, { email: string, title: string }> = {
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
  const { name: userName, role } = useUser();
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('https://placehold.co/100x100');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) {
      setAvatarPreview(savedAvatar);
    }
  }, []);

  useEffect(() => {
    setName(userName);
    if (role && profileDetails[role]) {
        setEmail(profileDetails[role].email);
        setTitle(profileDetails[role].title);
    }
  }, [userName, role]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveChanges = () => {
    // In a real application, you would make an API call here to save the changes.
    localStorage.setItem('user-avatar', avatarPreview);
    window.dispatchEvent(new Event('storage')); // Manually trigger storage event for the header to update

    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
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
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
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
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                    />
                    <Button variant="outline" onClick={handleUploadClick}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Picture
                    </Button>
                    <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB.</p>
                </div>
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
