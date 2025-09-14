import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthCallback } from "@/features/auth";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { LandingPage } from "@/features/public/pages/LandingPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { UpdatePasswordPage } from "@/features/auth/pages/UpdatePasswordPage";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";

// ProtectedRoute wrapper
const ProtectedRoute = ({
  isAllowed,
  redirectPath = "/login",
  isLoading,
  children,
}: {
  isAllowed: boolean;
  redirectPath?: string;
  isLoading?: boolean;
  children: React.JSX.Element;
}) => {
  if (isLoading) return <><LoadingSpinner/></>
  return isAllowed ? children : <Navigate to={redirectPath} replace />;
};

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            User Dashboard
          </h1>
          <p className="text-gray-600 mb-4">Welcome, {user?.name}!</p>
          <p className="text-sm text-gray-500 mb-4">Email: {user?.email}</p>
          <p className="text-sm text-gray-500 mb-6">Role: {user?.role}</p>
          <button onClick={logout} className="btn btn-secondary px-4 py-2">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const DriverDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Driver Dashboard
          </h1>
          <p className="text-gray-600 mb-4">Welcome, {user?.name}!</p>
          <p className="text-sm text-gray-500 mb-4">Email: {user?.email}</p>
          <p className="text-sm text-gray-500 mb-6">Role: {user?.role}</p>
          <button onClick={logout} className="btn btn-secondary px-4 py-2">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-4">Welcome, {user?.name}!</p>
          <p className="text-sm text-gray-500 mb-4">Email: {user?.email}</p>
          <p className="text-sm text-gray-500 mb-6">Role: {user?.role}</p>
          <button onClick={logout} className="btn btn-secondary px-4 py-2">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  console.log("is auth?", isAuthenticated);

  const getDashboardRedirect = () => {
    if (!user) return "/";
    switch (user.role) {
      case "Admin":
        return "/admin/dashboard";
      case "Driver":
        return "/driver/dashboard";
      case "Rider":
        return "/user/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <SignupPage />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <ForgotPasswordPage />
          )
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected routes */}
      <Route
        path="/update-password"
        element={
          <ProtectedRoute
            isAllowed={isAuthenticated}
            isLoading={isLoading}
            redirectPath="/login"
          >
            <UpdatePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute
            isAllowed={isAuthenticated && user?.role === "Rider"}
            isLoading={isLoading}
          >
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute
            isAllowed={isAuthenticated && user?.role === "Driver"}
            isLoading={isLoading}
          >
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            isAllowed={isAuthenticated && user?.role === "Admin"}
            isLoading={isLoading}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect shorthand */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAllowed={isAuthenticated} isLoading={isLoading}>
            <Navigate to={getDashboardRedirect()} replace />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
