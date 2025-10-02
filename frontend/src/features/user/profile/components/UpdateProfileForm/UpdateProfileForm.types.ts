import type {
  UserProfile,
  UserProfileFormData,
} from "../../types/userProfile.types";

export interface UpdateProfileFormProps {
  profile: UserProfile;
  onSave: (data: UserProfileFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}
