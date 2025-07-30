
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { role } = useUser();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const canEdit = isClient && role === 'Admin';

  const handleSaveChanges = () => {
    // In a real application, you would save these settings to a backend.
    toast({
      title: 'Settings Saved',
      description: 'Your new settings have been applied.',
    });
  };
  
  const handleChangePassword = () => {
    // In a real application, you would handle password change logic here.
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });
    setIsPasswordDialogOpen(false);
  };


  if (!isClient) {
    return (
       <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
               <Skeleton className="h-7 w-32" />
               <Skeleton className="h-5 w-64 mt-1" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
               <Skeleton className="h-7 w-40" />
               <Skeleton className="h-5 w-56 mt-1" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
               <Skeleton className="h-7 w-28" />
               <Skeleton className="h-5 w-52 mt-1" />
            </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-9 w-24" />
                </div>
                 <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                </div>
            </CardContent>
          </Card>
           <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences. Only Admins can modify settings.</p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Enable a darker color scheme for the interface.
                </span>
              </Label>
              <Switch 
                id="dark-mode" 
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive important updates via email.
                </span>
              </Label>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} disabled={!canEdit} />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Get real-time alerts on your device.
                </span>
              </Label>
              <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} disabled={!canEdit} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Change Password</p>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your new password below. Make sure it's secure.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="current-password" className="text-right">Current</Label>
                        <div className="col-span-3 relative">
                           <Input id="current-password" type={showCurrentPassword ? "text" : "password"} className="pr-10" />
                           <Button variant="ghost" size="icon" className="absolute top-1/2 right-0 -translate-y-1/2 h-8 w-8" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-password" className="text-right">New</Label>
                        <div className="col-span-3 relative">
                          <Input id="new-password" type={showNewPassword ? "text" : "password"} className="pr-10" />
                           <Button variant="ghost" size="icon" className="absolute top-1/2 right-0 -translate-y-1/2 h-8 w-8" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm-password" className="text-right">Confirm</Label>
                        <div className="col-span-3 relative">
                           <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} className="pr-10" />
                           <Button variant="ghost" size="icon" className="absolute top-1/2 right-0 -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleChangePassword}>Save new password</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
             <div className="flex items-center justify-between pt-4 border-t border-destructive/20 mt-4">
                <div className='flex flex-col'>
                    <p className="text-sm font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all of your data.</p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={!canEdit}>Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                            toast({
                                title: 'Account Deletion Requested',
                                description: 'Your account is scheduled for deletion.',
                                variant: 'destructive',
                            })
                            }
                        >
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={!canEdit}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
