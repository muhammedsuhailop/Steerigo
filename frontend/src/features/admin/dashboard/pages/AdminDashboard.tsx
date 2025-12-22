import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { Footer } from "@/features/public/components";
import { MdOutlineRefresh } from "react-icons/md";
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

  const { getDashboardStats, loading, refreshDashboardData } =
    useAdminDashboard();

  // Get stats using the hook
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
    // Show notification  //TODO
    console.log("Dashboard data refreshed");
  };

  const handleViewAllUsers = () => {
    // Navigate to users page
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
          <div className="flex items-center flex justify-end">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Refreshing..." : <MdOutlineRefresh />}
            </button>
          </div>

          <DashboardOverview userName={user?.name ?? ""} />
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
