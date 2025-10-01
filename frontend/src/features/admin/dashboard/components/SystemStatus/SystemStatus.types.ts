export interface SystemStatusProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    suspendedUsers: number;
    blockedUsers: number;
    inactiveUsers?: number;
  };
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export interface StatusCard {
  title: string;
  value: number;
  color: "emerald" | "blue" | "yellow" | "red" | "purple" | "gray";
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
}
