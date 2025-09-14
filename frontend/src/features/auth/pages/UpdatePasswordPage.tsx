import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UpdatePasswordForm } from "../components/UpdatePasswordForm";

export const UpdatePasswordPage: React.FC = () => {
    const { isAuthenticated, isLoading, initialize } = useAuth();
    console.log('is auth in update password', isAuthenticated);
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            initialize();
        }
    }, [isAuthenticated, isLoading, initialize]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Main Container */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
                    <UpdatePasswordForm />
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
                <div className="text-sm text-gray-600 space-x-4">
                    <a href="#" className="hover:text-gray-900">Help Center</a>
                    <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900">Terms of Service</a>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    © 2025 SteeriGo. All rights reserved.
                </p>
            </div>
        </div>
    );
};
