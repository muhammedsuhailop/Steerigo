import type { DriverStats } from "../../../shared/types/driver.types";

export interface DriverStatsProps {
  stats: DriverStats;
  loading?: boolean;
  className?: string;
}

export interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  color: "blue" | "emerald" | "yellow" | "purple";
  icon: React.ReactNode;
}
