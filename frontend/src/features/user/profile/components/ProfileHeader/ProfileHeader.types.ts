import type { UserProfile } from "../../types/userProfile.types";
import { UserStats } from "../../types/userStats.types";

export interface ProfileHeaderProps {
  profile: UserProfile;
  stats: UserStats | undefined;
  onEditClick: () => void;
  onDriverRegisterClick: () => void;
  onRegisterAsDriver?: () => Promise<{ success: boolean; error?: string }>;
  isRegisteringDriver?: boolean;
  isLoading?: boolean;
}
