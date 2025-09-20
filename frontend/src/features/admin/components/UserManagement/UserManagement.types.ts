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
}

export interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onAddUser: () => void;
  onExport: () => void;
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
