import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { Footer } from "@/features/public/components";
import { AdminSidebar, AdminTopbar } from "../../shared/components";
import {
  DashboardOverview,
  QuickActions,
  RecentActivity,
  RecentUsers,
  SystemStatus,
} from "../components";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    getDashboardStats,
    loading,
    refreshDashboardData,
    rawStats,
    filter,
    setFilter,
  } = useAdminDashboard();

  const stats = getDashboardStats();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const handleRefresh = () => {
    refreshDashboardData();
    console.log("Dashboard data refreshed");
  };

  const handleViewAllUsers = () => {
    window.location.href = "/admin/users";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Topbar */}
        <AdminTopbar onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 px-6 py-8 space-y-8">
          <DashboardOverview
            userName={user?.name ?? ""}
            userStats={rawStats.user}
            rideStats={rawStats.ride}
            driverStats={rawStats.driver}
            isLoading={loading}
            filter={filter}
            onFilterChange={setFilter}
          />

          <QuickActions />

          <SystemStatus
            stats={{
              totalUsers: stats.totalUsers,
              activeUsers: stats.activeDrivers,
              pendingUsers: stats.pendingKYCDrivers,
              suspendedUsers: stats.suspendedDrivers,
              blockedUsers: stats.blockedDrivers,
              inactiveUsers: stats.cancelledRides,
            }}
            loading={loading}
            onRefresh={handleRefresh}
          />

          <RecentActivity />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
