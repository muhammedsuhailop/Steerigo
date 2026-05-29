import { DateFilterOption } from "../../hooks/useAdminDashboard";
import {
  AdminUserStats,
  AdminRideStats,
  AdminDriverStats,
} from "../../types/adminDashboard.stats.types";

export interface OverviewStat {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    label?: string;
  };
  color: "blue" | "green" | "yellow" | "purple" | "red";
  icon?: string;
}

export interface StatCardProps {
  stat: OverviewStat;
}

export interface DashboardOverviewProps {
  userName: string;
  userStats?: AdminUserStats;
  rideStats?: AdminRideStats;
  driverStats?: AdminDriverStats;
  isLoading?: boolean;
  filter: DateFilterOption;
  onFilterChange: (filter: DateFilterOption) => void;
  fromDate?: Date | null | string;
  onFromDateChange: (date: Date | null) => void;
  toDate?: Date | null | string;
  onToDateChange: (date: Date | null) => void;
}
