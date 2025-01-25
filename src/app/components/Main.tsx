'use client';


import AuraRing from './AuraRing';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export default function Main() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('googleTokens');
        }
        return false;
    });

    const { data: authData } = useQuery({
      queryKey: ['googleAuth'],
      queryFn: async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (code) {
          const response = await fetch(`/api/google/callback?code=${code}`);
          const data = await response.json();
          if (data.tokens) {
            localStorage.setItem('googleTokens', JSON.stringify(data.tokens));
            setIsAuthenticated(true);
            return data;
          }
        } else {
          const storedTokens = localStorage.getItem('googleTokens');
          if (storedTokens) {
            return { tokens: JSON.parse(storedTokens) };
          }
        }
        return null;
      },
      enabled: typeof window !== 'undefined'
    });
  
    const handleGoogleLogin = useCallback(async () => {
      try {
        const response = await fetch('/api/google/login');
        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error('Failed to initiate Google login:', error);
      }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center p-8 gap-8">
        {!isAuthenticated && (
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 4.36c1.6 0 3.04.55 4.18 1.63l3.17-3.17C17.45 1.05 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        )}
        {isAuthenticated && <AuraRing />}
      </div>
    )
}