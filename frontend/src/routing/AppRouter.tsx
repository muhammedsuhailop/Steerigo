import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthCallback } from "@/features/auth";
import LoginPage from "@/features/auth/pages/LoginPage";
import LandingPage from "@/features/public/pages/LandingPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import UpdatePasswordPage from "@/features/auth/pages/UpdatePasswordPage";
import UserDashboard from "@/features/user/dashbaord/pages/UserDashboard";
import DriverDashboard from "@/features/driver/dashboard/pages/DriverDashboard";
import AdminDashboard from "@/features/admin/dashboard/pages/AdminDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminUsersLayout from "@/features/admin/user/user-management/pages/AdminUsersLayout";
import { NotFoundPage } from "@/features/public/pages";
import { DriverRegistrationPage } from "@/features/driver/driver-registration/pages";
import DriverManagementLayout from "@/features/admin/driver/driver-management/pages/DriverManagementLayout";
import DriverProfileViewPage from "@/features/admin/driver/view-profile/pages/DriverProfileViewPage";
import KYCRequestsLayout from "@/features/admin/kyc-management/kyc-requests/pages/AdminKYCLayout";
import { UserProfileLayout } from "@/features/user";
import DriverScheduling from "@/features/driver/scheduling/pages/DriverScheduling";
import KYCRequestDetailPage from "@/features/admin/kyc-management/KYCDetailComponent/pages/KYCRequestDetailPage";
import AdminDetailLayout from "@/features/admin/shared/pages/AdminDetailLayout";
import DriverProfilePage from "@/features/driver/profile/pages/DriverProfilePage";
import DriverSearchPage from "@/features/user/driver-search/pages/DriverSearchPage";
import HelpPage from "@/features/public/pages/Help";
import UserProfileViewPage from "@/features/admin/user/user-profile/UserProfileViewPage";
import { RideRequestsPage } from "@/features/driver/ride-requests/pages/RideRequestsPage";
import ViewRidePage from "@/features/user/view-ride/pages/ViewRidePage";
import ViewDriverRidePage from "@/features/driver/view-ride/pages/ViewDriverRidePage";
import WalletPage from "@/features/driver/wallet/pages/WalletPage";
import PayoutPage from "@/features/driver/payout/pages/PayoutPage";
import PayoutManagement from "@/features/admin/payouts/pages/PayoutManagement";
import { useNotificationSocket } from "@/features/notifications/hooks/useNotificationSocket";
import DriverRidesPage from "@/features/driver/driver-rides/pages/DriverRidesPage";
import UserRidesPage from "@/features/user/rides/pages/UserRidesPage";
import TransactionPage from "@/features/admin/transactions/pages/TransactionsPage";
import RideManagement from "@/features/admin/rides/pages/RideManagement";
import { RideView } from "@/features/admin/rides/pages/RideView";
import CouponManagement from "@/features/admin/coupons/pages/CouponManagement";
import { FloatingChatWindow } from "@/features/chat/components/FloatingChatWindow";
import FutureSchedulePage from "@/features/user/driver-search/pages/FutureSchedulePage";
import GlobalLocationSync from "@/shared/components/ui/LiveLocationUpdater/GlobalLocationSync";

export const AppRouter: React.FC = () => {
  const { user } = useAuth();
  useNotificationSocket();

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
    <>
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
          path="/admin/users/:userId"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <UserProfileViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DriverManagementLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers/:driverId"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DriverProfileViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kyc-requests"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <KYCRequestsLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kyc-requests/:requestId"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <KYCRequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers/payouts"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <PayoutManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <TransactionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rides"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <RideManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rides/:rideId"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <RideView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CouponManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <DriverSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search/schedule"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <FutureSchedulePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <HelpPage /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <UserProfileLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <UserRidesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ride/:id"
          element={
            <ProtectedRoute allowedRoles={["Rider"]}>
              <ViewRidePage />
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
          path="/driver/schedule"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <DriverScheduling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/profile"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <DriverProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/ride-requests"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <RideRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/rides"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <DriverRidesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/ride/:id"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <ViewDriverRidePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/wallet"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/payouts"
          element={
            <ProtectedRoute allowedRoles={["Driver"]}>
              <PayoutPage />
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

      {user && <FloatingChatWindow />}

      {user?.role === "Driver" && <GlobalLocationSync />}
    </>
  );
};
