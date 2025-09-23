import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";

const UpdatePasswordPage: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      initialize();
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, initialize, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
            <UpdatePasswordForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdatePasswordPage;
