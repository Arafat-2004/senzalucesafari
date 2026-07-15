'use client';

import { useEffect, useState } from 'react';

export function useSessionCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/auth-check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          window.location.href = '/admin/login';
          return;
        }
        
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          window.location.href = '/admin/login';
        }
      } catch {
        window.location.href = '/admin/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return { isLoading, isAuthenticated };
}