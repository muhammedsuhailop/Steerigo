import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthCallback } from "@/features/auth";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { LandingPage } from "@/features/public/pages/LandingPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

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
  const { isAuthenticated, user } = useAuth();

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
        path="forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <ForgotPasswordPage />
          )
        }
      />

      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected dashboard routes */}
      <Route
        path="/user/dashboard"
        element={
          isAuthenticated && user?.role === "Rider" ? (
            <UserDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/driver/dashboard"
        element={
          isAuthenticated && user?.role === "Driver" ? (
            <DriverDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          isAuthenticated && user?.role === "Admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Redirect shorthand */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
