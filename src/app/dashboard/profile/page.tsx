
'use client';

import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('The Manager');
  const [email, setEmail] = useState('manager@bizview.com');
  const [title, setTitle] = useState('Senior Business Manager');
  const [avatarPreview, setAvatarPreview] = useState('https://placehold.co/100x100');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedAvatar = localStorage.getItem('user-avatar');
    if (savedAvatar) {
      setAvatarPreview(savedAvatar);
    }
  }, []);

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
    return null; // or a loading skeleton
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={avatarPreview} alt="@manager" data-ai-hint="person" />
              <AvatarFallback>M</AvatarFallback>
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
