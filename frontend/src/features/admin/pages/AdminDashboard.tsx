import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
  AdminSidebar,
  AdminTopbar,
  DashboardOverview,
  RecentActivity,
  QuickActions,
} from "@/features/admin/components";
import { Footer } from "@/features/public/components";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get users data from Redux store safely
  const { users = [], pagination } = useSelector(
    (state: RootState) => state.adminUsers || {}
  );
  const totalUsers = pagination?.totalItems || 0;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const pendingUsers = users.filter(
    (u) => u.status === "Pending Verification"
  ).length;

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
          <DashboardOverview />
          <QuickActions />

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
