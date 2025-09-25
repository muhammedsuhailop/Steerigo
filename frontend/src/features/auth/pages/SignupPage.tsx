import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SignupForm } from "@/features/auth/components/SigupForm";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";

const SignupPage: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuth();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/user/dashboard";
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <SignupForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;
