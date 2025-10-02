export interface OverviewStat {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  color: "blue" | "green" | "yellow" | "purple" | "red";
  icon?: string;
}

export interface StatCardProps {
  stat: OverviewStat;
}

export interface DashboardOverviewProps {
  userName: string;
}
