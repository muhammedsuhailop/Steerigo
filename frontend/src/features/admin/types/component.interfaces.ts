import { AdminUser, AdminUserFilters } from './admin.types';

// User Table Props
export interface AdminUserTableProps {
  users: AdminUser[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUserUpdate: (user: AdminUser) => void;
  onUserDelete: (userId: string) => void;
}

// User Actions Props
export interface AdminUserActionsProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: string) => void;
  onStatusToggle: (userId: string, status: string) => void;
}

// Filter Props
export interface AdminUserFiltersProps {
  filters: AdminUserFilters;
  onFiltersChange: (filters: Partial<AdminUserFilters>) => void;
  onClearFilters: () => void;
}

// Badge Props for user status/role
export interface AdminUserBadgeProps {
  user: AdminUser;
  type: 'status' | 'role' | 'verification';
}
