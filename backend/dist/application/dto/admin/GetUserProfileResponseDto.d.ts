import { Gender } from "../../../domain/value-objects/Gender";
import { UserStatus, UserRole, AuthProvider } from "../../../shared/constants/AuthConstants";
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
    dob?: Date;
    gender?: Gender;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserAccountStats {
    totalBookings: number;
    totalSpent: number;
    lastBookingDate: Date | null;
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
//# sourceMappingURL=GetUserProfileResponseDto.d.ts.map