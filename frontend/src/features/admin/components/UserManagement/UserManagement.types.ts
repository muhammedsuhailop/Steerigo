export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending Verification";
  totalBookings: number;
  totalSpent: number;
  lastBooked?: string;
  createdAt: string;
  avatar?: string;
}

export interface UserFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface UserManagementProps {
  className?: string;
}

export interface UserTableProps {
  users: User[];
  loading: boolean;
  onUserClick: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onAddUser: () => void;
  onExport: () => void;
}
