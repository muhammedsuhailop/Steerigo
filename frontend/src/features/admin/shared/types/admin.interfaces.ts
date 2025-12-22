import { ReactNode } from "react";
import type {
  User,
  UserFilters,
  UserAction,
} from "../../user/user-management/components/UserManagement/UserManagement.types";
// import { DashboardStats } from "../services/AdminStatsService";

export interface AdminDataService {
  fetchUsers(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    success: boolean;
    data: {
      users: User[];
      pagination: {
        totalItems: number;
        totalPages: number;
        page: number;
        pageSize: number;
      };
    };
  }>;
  updateUserStatus(
    userId: string,
    action: UserAction
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }>;
}

export interface AdminStateService {
  setFilters(filters: Partial<UserFilters>): void;
  setPage(page: number): void;
  setLimit(limit: number): void;
  clearActionLoading(userId: string): void;
  resetFilters(): void;
}

export interface AdminNotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
  showInfo(message: string): void;
}

export interface AdminDetailLayoutProps {
  children: ReactNode;
  title?: string;
}
export interface AdminUser {
  id: string;
  userId?: string;
  name: string;
  email: string;
  mobile?: string;
  status:
    | "Active"
    | "Inactive"
    | "Suspended"
    | "Pending Verification"
    | "Blocked";
  role: string;
  totalBookings: number;
  totalSpent: number;
  lastBooked?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface AdminDriverUser {
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
}

export interface AdminDriverStatusInfo {
  status: string;
  kycStatus: string;
  licenceCategory: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
}

export interface AdminDriverLicense {
  licenseIssueDate: string; // ISO date string
  licenseExpiryDate: string; // ISO date string
}

export interface AdminDriverStats {
  totalRides: number;
  totalEarnings: number;
  rating: number;
  lastRideDate: string | null; // ISO or null
}
export interface AdminDriver {
  lastSeenAt: string | number | Date;
  driverId: string;
  user: AdminDriverUser;
  statusInfo: AdminDriverStatusInfo;
  license: AdminDriverLicense;
  stats: AdminDriverStats;
  createdAt: string; // ISO date string
  profileImage?: string;
}

// KYC TYPES
export interface KYCDocument {
  id: string;
  docType: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string | null;
  verificationStatus: "InReview" | "Approved" | "Rejected";
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface KYCDriver {
  driverId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  driverStatus: "Active" | "Inactive" | "Suspended";
}

export interface KYCRequest {
  kyc: KYCDocument;
  driver: KYCDriver;
}

export interface KYCDetailResponse {
  success: boolean;
  message: string;
  data: KYCRequest;
}

export interface KYCUpdateResponse {
  success: boolean;
  message: string;
  data?: KYCRequest;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  pageSize?: number;
}

export interface PaginationResponse {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
