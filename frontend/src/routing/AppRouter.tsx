import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthCallback } from "@/features/auth";
import LoginPage from "@/features/auth/pages/LoginPage";
import LandingPage from "@/features/public/pages/LandingPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import UpdatePasswordPage from "@/features/auth/pages/UpdatePasswordPage";
import UserDashboard from "@/features/user/pages/UserDashboard";
import DriverDashboard from "@/features/driver/dashboard/pages/DriverDashboard";
import AdminDashboard from "@/features/admin/dashboard/pages/AdminDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminUsersLayout from "@/features/admin/user-management/pages/AdminUsersLayout";
import { NotFoundPage } from "@/features/public/pages";
import { DriverRegistrationPage } from "@/features/driver/driver-registration/pages";

export const AppRouter: React.FC = () => {
  const { user } = useAuth();

  const getDashboardRedirect = () => {
    switch (user?.role) {
      case "Admin":
        return "/admin/dashboard";
      case "Driver":
        return "/driver/dashboard";
      case "Rider":
        return "/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <SignupPage />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          user ? (
            <Navigate to={getDashboardRedirect()} replace />
          ) : (
            <ForgotPasswordPage />
          )
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected */}
      <Route
        path="/update-password"
        element={
          <ProtectedRoute>
            <UpdatePasswordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminUsersLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Driver"]}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/register"
        element={
          <ProtectedRoute allowedRoles={["Driver"]}>
            <DriverRegistrationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Rider"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
