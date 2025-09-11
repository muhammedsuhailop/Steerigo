import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { initializeAuth } from "@/redux/slices/authSlice";

// Components
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Auth Components
import LoginForm from "@/features/auth/components/LoginForm";
import SignupForm from "@/features/auth/components/SignupForm";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

// Pages
import LandingPage from "@/pages/LandingPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AuthCallback from "./features/auth/components/AuthCallback";
import HomePage from "@/features/user/pages/HomePage";

const DriverDashboard: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Driver Dashboard</h1>
    <p>Welcome to your driver dashboard!</p>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <p>Welcome to your admin dashboard!</p>
  </div>
);

function AppContent(): React.JSX.Element {
  useEffect(() => {
    // Initialize auth state from localStorage on app load
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes - Rider */}
        <Route
          path="/user/home"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Driver */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
