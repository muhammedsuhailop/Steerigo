import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { AdminServiceContainer } from "../services/AdminServiceContainer";
import { useAppDispatch } from "@/app/store/hooks";
import {
  AdminSidebar,
  AdminTopbar,
  DashboardOverview,
  RecentActivity,
  QuickActions,
  SystemStatus,
  RecentUsers,
} from "@/features/admin/components";
import { Footer } from "@/features/public/components";
import { MdOutlineRefresh } from "react-icons/md";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use service layer instead of direct Redux access
  const { getDashboardStats, loading, refreshDashboardData } =
    useAdminDashboard();

  // Initialize services
  const container = AdminServiceContainer.getInstance();
  try {
    container.getServices();
  } catch {
    container.initialize(dispatch);
  }
  const services = container.getServices();

  // Get stats using service layer
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
    services.notificationService.showInfo("Dashboard data refreshed");
  };

  const handleViewAllUsers = () => {
    // Navigate to users page
    window.location.href = "/admin/users";
  };

  const handleUserClick = (clickedUser: any) => {
    // Handle user click - could navigate to user detail page
    services.notificationService.showInfo(
      `Viewing details for ${clickedUser.name}`
    );
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Refreshing..." : <MdOutlineRefresh />}
            </button>
          </div>

          <DashboardOverview />
          <QuickActions />

          {/* System Status Component */}
          <SystemStatus
            stats={{
              totalUsers: stats.totalUsers,
              activeUsers: stats.activeUsers,
              pendingUsers: stats.pendingUsers,
              suspendedUsers: stats.suspendedUsers,
              blockedUsers: stats.blockedUsers,
              inactiveUsers: stats.inactiveUsers,
            }}
            loading={loading}
            onRefresh={handleRefresh}
          />

          {/* Recent Users Component */}
          <RecentUsers
            users={stats.recentUsers}
            loading={loading}
            onUserClick={handleUserClick}
            onViewAll={handleViewAllUsers}
            maxUsers={5}
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
