
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

const defaultNames: Record<UserRole, string> = {
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
    function checkUser() {
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
            setUser({
                name: 'Guest',
                role: 'Guest',
                isAuthenticated: false
            })
        }
    }

    checkUser();

    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      const key = event instanceof CustomEvent ? event.detail.key : event.key;
      const role = getCookie('user_role') as UserRole | undefined;
      if (key === `user-name-${role}`) {
        checkUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // A simple way to detect navigation changes for SPAs
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        checkUser();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        checkUser();
    };
    
    window.addEventListener('popstate', checkUser);

    const interval = setInterval(checkUser, 1000);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('popstate', checkUser);
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;
        clearInterval(interval);
    };
  }, []);

  return user;
}
