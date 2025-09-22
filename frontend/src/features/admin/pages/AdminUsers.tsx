import React from 'react';
import { UserManagement } from '@/features/admin/components/UserManagement';

const AdminUsers: React.FC = () => {
  return (
    <div className="p-6">
      <UserManagement />
    </div>
  );
};

export default AdminUsers;