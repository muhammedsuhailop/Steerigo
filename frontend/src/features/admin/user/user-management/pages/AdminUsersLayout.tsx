import React from "react";
import { useAuth } from "@/features/auth";
import { UserManagement } from "@/features/admin/user/user-management/components/UserManagement";
import { AdminLayout } from "@/features/admin/shared/components/AdminLayout/AdminLayout";

const AdminUsersLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <AdminLayout title="Admin - Users">
      <div className="p-6">
        <UserManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminUsersLayout;
