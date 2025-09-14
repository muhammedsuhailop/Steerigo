import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
    children: React.ReactElement;
    redirectPath?: string;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectPath = "/login",
    allowedRoles,
}) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    if (!isAuthenticated) return <Navigate to={redirectPath} replace />;

    if (allowedRoles && !allowedRoles.includes(user?.role || " ")) {
        return <Navigate to="/" replace />;
    }

    return children;
};

