export interface AdminUserProfileInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  profilePicture?: string;
  status: string;
  role: string;
  isVerified: boolean;
  authProvider: string;
  address?: string;
  dob?: string | undefined;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAccountStats {
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string | null;
  joinedDaysAgo: number;
}

export interface UserActivityStatus {
  isActive: boolean;
  lastLoginDate: Date | null;
}

export interface UserProfileMetadata {
  hasCompletedProfile: boolean;
  documentVerificationStatus?: string;
}

export interface GetUserProfileResponse {
  userInfo: AdminUserProfileInfo;
  accountStats: UserAccountStats;
  activityStatus: UserActivityStatus;
  metadata: UserProfileMetadata;
}

export interface AdminUserProfileResponse {
  success: boolean;
  data: GetUserProfileResponse;
}
