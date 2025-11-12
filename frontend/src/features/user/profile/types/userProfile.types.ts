export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profilePicture?: string;
  isVerified: boolean;
  role: "Rider" | "Driver" | "Admin";
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileFormData {
  name: string;
  email: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

export interface UpdateProfileRequest {
  userId: string;
  data: Partial<UserProfileFormData>;
}

export interface UserStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalSpent: number;
  memberSince: string;
  favoriteDrivers: string[];
}

export interface ProfileHeaderProps {
  profile: UserProfile;
  stats: UserStats;
  onEditClick: () => void;
  onDriverRegisterClick: () => void;
  isLoading?: boolean;
}

export interface UpdateProfileFormProps {
  profile: UserProfile;
  onSave: (data: UserProfileFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface ProfileStatsProps {
  stats: UserStats;
  isLoading?: boolean;
}

export interface ProfilePictureData {
  profilePictureUrl: string;
  publicId: string;
  userId: string;
  updatedAt: string;
}
