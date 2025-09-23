import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { AdminSidebar, AdminTopbar } from "@/features/admin/components";
import AdminUsers from "./AdminUsers";

const AdminUsersLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Topbar */}
        <AdminTopbar
          title="Admin - Users"
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AdminUsers />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminUsersLayout;