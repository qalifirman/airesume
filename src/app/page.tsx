"use client"; // Required for hooks

import { useState, useEffect } from 'react';
import { AuthPage } from '@/app/components/AuthPage';
import { HRDashboard } from '@/app/components/HRDashboard';
import { ApplicantDashboard } from '@/app/components/ApplicantDashboard';
import { Toaster } from 'sonner';

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
    }
    
    setLoading(false);
  }, []);
  
  const handleLogin = (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
  };
  
  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };
  
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
  
  // Not authenticated - show login/register
  if (!user || !accessToken) {
    return (
      <>
        <AuthPage onLoginSuccess={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }
  
  // Authenticated - show appropriate dashboard based on role
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