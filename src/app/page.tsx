"use client";

import { useState, useEffect } from 'react';
import { AuthPage } from '@/app/components/AuthPage';
import { HRDashboard } from '@/app/components/HRDashboard';
import { ApplicantDashboard } from '@/app/components/ApplicantDashboard';
import { Toaster } from 'sonner';

// 1. Define a proper User interface to fix 'any' errors
interface UserMetadata {
  role?: 'hr' | 'applicant';
}

interface User {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
}

export default function Page() {
  // 2. Initialize with null/empty strings correctly
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. This only runs on the client, preventing "localStorage is not defined" errors
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // 4. Handle the Loading State properly
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  // 5. Check if user and token actually exist
  if (!user || !accessToken) {
    return (
      <>
        <AuthPage onLoginSuccess={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  const userRole = user.user_metadata?.role || 'applicant';

  return (
    <>
      {userRole === 'hr' ? (
        <HRDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />
      ) : (
        <ApplicantDashboard user={user} accessToken={accessToken} onLogout={handleLogout} />
      )}
      <Toaster position="top-right" />
    </>
  );
}