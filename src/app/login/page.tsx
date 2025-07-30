
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('Manager');
  const [isForgotDialogOpen, setIsForgotDialogOpen] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // In a real app, you would validate credentials against a server.
    // Here, we'll just set cookies to simulate a logged-in state.
    document.cookie = 'auth_token=true; path=/; max-age=3600'; // Expires in 1 hour
    document.cookie = `user_role=${role}; path=/; max-age=3600`;
    router.push('/dashboard');
  };
  
  const handlePasswordReset = () => {
    toast({
        title: "Password Reset Email Sent",
        description: "If an account with that email exists, a reset link has been sent."
    });
    setIsForgotDialogOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">BizView</h1>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="manager@bizview.com" required defaultValue="manager@bizview.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Dialog open={isForgotDialogOpen} onOpenChange={setIsForgotDialogOpen}>
                    <DialogTrigger asChild>
                       <button type="button" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Forgot Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reset-email" className="text-right">Email</Label>
                            <Input id="reset-email" type="email" placeholder="you@example.com" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handlePasswordReset}>Send Reset Link</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Input id="password" type="password" required defaultValue="password" />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="role">Role</Label>
                  <Select onValueChange={setRole} defaultValue="Manager">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Select a role to simulate different permissions.</p>
              </div>
              <Button type="submit" className="w-full text-lg py-6">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
