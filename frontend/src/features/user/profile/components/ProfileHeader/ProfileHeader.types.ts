import type { UserProfile, UserStats } from "../../types/userProfile.types";

export interface ProfileHeaderProps {
  profile: UserProfile;
  stats: UserStats;
  onEditClick: () => void;
  onDriverRegisterClick: () => void;
  onRegisterAsDriver?: () => Promise<{ success: boolean; error?: string }>;
  isRegisteringDriver?: boolean;
  isLoading?: boolean;
}
