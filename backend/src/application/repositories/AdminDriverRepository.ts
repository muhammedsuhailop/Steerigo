import {
  FilterOptions,
  QueryOptions,
  PaginatedResult,
} from "@shared/types/Repository";
import { Driver } from "@domain/entities/Driver";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";

export interface AdminDriverQuery {
  status?: string;
  kycStatus?: string;
  licenceCategory?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminDriverSummary {
  driverId: string;
  userId: string;
  userName: string; // From User entity
  userEmail: string; // From User entity
  userMobile: string; // From User entity
  status: string;
  kycStatus: string;
  licenceCategory: string;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  totalRides: number;
  totalEarnings: number;
  rating: number;
  lastRideDate?: Date;
  createdAt: Date;
}

export interface AdminDriverRepository
  extends ReadOnlyRepository<Driver>,
    QueryableRepository<Driver> {
  findDriversWithSummary(
    filters: AdminDriverQuery,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: AdminDriverSummary[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }>;

  findByUserId(userId: string): Promise<Driver | null>;

  updateDriverStatus(
    driverId: string,
    status: string,
    reason?: string
  ): Promise<boolean>;

  getDriverStats(driverId: string): Promise<{
    totalRides: number;
    totalEarnings: number;
    rating: number;
    lastRideDate?: Date;
  }>;

  findDriverProfile(driverId: string): Promise<{
    driver: Driver;
    user: {
      id: string;
      name: string;
      email: string;
      mobile: string;
    };
    stats: {
      totalRides: number;
      totalEarnings: number;
      rating: number;
      lastRideDate?: Date;
    };
  } | null>;
}
