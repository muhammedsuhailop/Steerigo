import type { User } from "../../../user/user-management/components/UserManagement/UserManagement.types";

export interface RecentUsersProps {
  users: User[];
  loading?: boolean;
  onUserClick?: (user: User) => void;
  onViewAll?: () => void;
  maxUsers?: number;
  className?: string;
}

export interface UserItemProps {
  user: User;
  onClick?: (user: User) => void;
}
