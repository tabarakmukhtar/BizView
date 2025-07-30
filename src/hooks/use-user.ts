
'use client';

import { useState, useEffect } from 'react';

type UserRole = 'Manager' | 'Admin' | 'Accountant' | 'Guest';

interface User {
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
}

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
};

const names: Record<UserRole, string> = {
    Manager: "The Manager",
    Admin: "The Admin",
    Accountant: "The Accountant",
    Guest: "Guest"
}

export function useUser(): User {
  const [user, setUser] = useState<User>({
    name: 'Guest',
    role: 'Guest',
    isAuthenticated: false,
  });

  useEffect(() => {
    const role = getCookie('user_role') as UserRole | undefined;
    const authToken = getCookie('auth_token');

    if (role && authToken === 'true') {
        setUser({
            name: names[role] || "User",
            role: role,
            isAuthenticated: true,
        });
    } else {
        setUser({
            name: 'Guest',
            role: 'Guest',
            isAuthenticated: false
        })
    }
  }, []);

  return user;
}
