import type { User } from "../UserManagement/UserManagement.types";

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
