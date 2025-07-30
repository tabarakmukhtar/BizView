
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // In a real app, you would validate credentials against a server.
    // Here, we'll just set a cookie to simulate a logged-in state.
    document.cookie = 'auth_token=true; path=/; max-age=3600'; // Expires in 1 hour
    router.push('/dashboard');
  };

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
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" type="password" required defaultValue="password" />
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
