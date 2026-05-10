'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useSessionCheck() {
  const router = useRouter();
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
          router.push('/admin/login');
          return;
        }
        
        const data = await response.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  return { isLoading, isAuthenticated };
}