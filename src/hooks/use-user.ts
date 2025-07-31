
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIsClient } from './use-is-client';

type UserRole = 'Manager' | 'Admin' | 'Accountant' | 'Guest';

interface User {
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
}

interface UserHook extends User {
  logout: () => void;
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

const defaultNames: Record<UserRole, string> = {
    Manager: "The Manager",
    Admin: "The Admin",
    Accountant: "The Accountant",
    Guest: "Guest"
}

const GUEST_USER: User = {
    name: 'Guest',
    role: 'Guest',
    isAuthenticated: false,
};

export function useUser(): UserHook {
  const [user, setUser] = useState<User>(GUEST_USER);
  const isClient = useIsClient();

  const checkUser = useCallback(() => {
    if (!isClient) return;

    const role = getCookie('user_role') as UserRole | undefined;
    const authToken = getCookie('auth_token');

    if (role && authToken === 'true') {
        const savedName = localStorage.getItem(`user-name-${role}`);
        setUser({
            name: savedName || defaultNames[role] || "User",
            role: role,
            isAuthenticated: true,
        });
    } else {
        setUser(GUEST_USER);
    }
  }, [isClient]);

  const logout = useCallback(() => {
    if (!isClient) return;
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(GUEST_USER);
  }, [isClient]);

  useEffect(() => {
    checkUser();
    
    // Check user on subsequent navigations or focus changes
    window.addEventListener('focus', checkUser);
    window.addEventListener('storage', checkUser); // When another tab logs in/out

    return () => {
      window.removeEventListener('focus', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, [checkUser]);


  return { ...user, logout };
}
