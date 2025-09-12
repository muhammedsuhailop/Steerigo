import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuth();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Main Login Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <LoginForm />
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-600 space-x-6">
          <a href="/help" className="hover:text-gray-900">
            Help Center
          </a>
          <a href="/privacy" className="hover:text-gray-900">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-900">
            Terms of Service
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          © 2025 SteeriGo. All rights reserved.
        </p>
      </div>
    </div>
  );
};