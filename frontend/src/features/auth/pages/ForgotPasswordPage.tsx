import React, { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPassword";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";

const ForgotPasswordPage: React.FC = () => {
  const { isLoading, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
