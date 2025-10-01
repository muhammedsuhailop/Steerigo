export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  status:
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Pending Verification"
    | "Blocked";
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
  dateFrom: string;
  dateTo: string;
}

export interface UserManagementProps {
  className?: string;
}

export interface UserTableProps {
  users: User[];
  loading: boolean;
  onUserClick: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onUserAction: (userId: string, action: UserAction) => Promise<void>;
  isActionLoading: (userId: string) => boolean;
}

export interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onResetFilters: () => void;
  loading: boolean;
}

export type UserAction =
  | "activate"
  | "suspend"
  | "deactivate"
  | "verify"
  | "block";

export interface ActionOption {
  value: UserAction;
  label: string;
  description: string;
  variant: "success" | "warning" | "danger" | "info";
}

export const USER_ACTIONS: Record<UserAction, ActionOption> = {
  activate: {
    value: "activate",
    label: "Activate",
    description: "Set user status to Active",
    variant: "success",
  },
  verify: {
    value: "verify",
    label: "Verify",
    description: "Verify user account",
    variant: "info",
  },
  suspend: {
    value: "suspend",
    label: "Suspend",
    description: "Temporarily suspend user",
    variant: "warning",
  },
  deactivate: {
    value: "deactivate",
    label: "Deactivate",
    description: "Deactivate user account",
    variant: "warning",
  },
  block: {
    value: "block",
    label: "Block",
    description: "Block user permanently",
    variant: "danger",
  },
};

export const getAvailableActions = (status: User["status"]): UserAction[] => {
  switch (status) {
    case "Pending Verification":
      return ["verify", "block"];
    case "Active":
      return ["suspend", "deactivate", "block"];
    case "Inactive":
      return ["activate", "block"];
    case "Suspended":
      return ["activate", "deactivate", "block"];
    case "Blocked":
      return ["activate"];
    default:
      return [];
  }
};

export const getDefaultFilters = (): UserFilters => ({
  search: "",
  status: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  dateFrom: "",
  dateTo: "",
});

export const validateDateRange = (
  dateFrom: string,
  dateTo: string
): boolean => {
  if (!dateFrom || !dateTo) return true;
  return new Date(dateFrom) <= new Date(dateTo);
};
