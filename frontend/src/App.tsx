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
// import ProtectedRoute from '@/components/common/ProtectedRoute';

// Auth Components
import LoginForm from "@/features/auth/components/LoginForm";
import SignupForm from "@/features/auth/components/SignupForm";

// Pages
import LandingPage from "@/pages/LandingPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Dashboard placeholders (you'll implement these later)
// const RiderDashboard = React.lazy(() => import('@/features/rider/pages/RiderDashboard'));
// const DriverDashboard = React.lazy(() => import('@/features/driver/pages/DriverDashboard'));
// const AdminDashboard = React.lazy(() => import('@/features/admin/pages/AdminDashboard'));

function AppContent(): React.JSX.Element {
  useEffect(() => {
    // Initialize auth state from localStorage on app load
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Router>
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes - Rider */}
          {/* <Route
            path="/rider/dashboard"
            element={
              <ProtectedRoute allowedRoles={['rider']}>
                <RiderDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Protected Routes - Driver */}
          {/* <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Protected Routes - Admin */}
          {/* <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Fallback Routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </React.Suspense>
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
