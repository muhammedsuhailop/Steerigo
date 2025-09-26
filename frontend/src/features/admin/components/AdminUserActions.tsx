import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { AdminUserActionsProps } from '../types/component.interfaces';
import { AdminUser } from '../types/admin.types';

export const AdminUserActions: React.FC<AdminUserActionsProps> = ({
  user,
  onEdit,
  onDelete,
  onStatusToggle,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusToggle(user.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    onDelete(user.id);
  };

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Suspended', label: 'Suspended' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {/* Status Toggle */}
      <Select
              value={user.status || 'Active'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              size="sm"
              className="w-24" options={[]}      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {/* Edit Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(user)}
        disabled={isUpdating}
      >
        Edit
      </Button>

      {/* Delete Button */}
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={isUpdating}
      >
        Delete
      </Button>
    </div>
  );
};
