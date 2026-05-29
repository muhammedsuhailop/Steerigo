export type UserStatus =
  | "Active"
  | "Inactive"
  | "Suspended"
  | "Blocked"
  | "Pending Verification";
export type UserRole = "Rider" | "Driver" | "Admin";
export type AuthProvider = "email" | "google";
export type Gender = "Male" | "Female" | "Other";
export type UserProfileAction =
  | "Activate"
  | "Suspend"
  | "Block"
  | "Unblock"
  | "Verify"
  | "Unverify";

export interface AdminUserProfileInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  profilePicture?: string;
  status: UserStatus;
  role: UserRole;
  isVerified: boolean;
  authProvider: AuthProvider;
  address?: string;
  dob?: string;
  gender?: Gender;
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

export interface GetUserProfileResponseDto {
  userInfo: AdminUserProfileInfo;
  accountStats: UserAccountStats;
  activityStatus: UserActivityStatus;
  metadata: UserProfileMetadata;
}
