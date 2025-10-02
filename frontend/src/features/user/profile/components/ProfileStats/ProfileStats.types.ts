import type { UserStats } from "../../types/userProfile.types";

export interface ProfileStatsProps {
  stats: UserStats;
  isLoading?: boolean;
}
