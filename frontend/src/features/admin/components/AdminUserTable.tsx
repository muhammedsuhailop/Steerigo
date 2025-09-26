import React from 'react';
import { Table } from '@/shared/components/ui/Table';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { AdminUserTableProps } from '../types/component.interfaces';
import { AdminUserBadge } from './AdminUserBadge';
import { AdminUserActions } from './AdminUserActions';

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onUserUpdate,
  onUserDelete,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    );
  }

  const handleStatusToggle = async (userId: string, status: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await onUserUpdate({ ...user, status: status as any });
    }
  };

  const handleUserDelete = (userId: string) => {
    onUserDelete(userId);
  };

  const handleUserEdit = (user: any) => {
    // For now, just update verification status as an example
    onUserUpdate({ ...user, isVerified: !user.isVerified });
  };

  const tableData = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    mobile: user.mobile || 'N/A',
    role: <AdminUserBadge user={user} type="role" />,
    status: <AdminUserBadge user={user} type="status" />,
    verified: <AdminUserBadge user={user} type="verification" />,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    actions: (
      <AdminUserActions
        user={user}
        onEdit={handleUserEdit}
        onDelete={handleUserDelete}
        onStatusToggle={handleStatusToggle}
      />
    ),
  }));

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Mobile' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'verified', header: 'Verified' },
    { key: 'createdAt', header: 'Created' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table data={tableData} columns={columns} />
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
