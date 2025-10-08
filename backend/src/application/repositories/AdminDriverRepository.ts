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
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminDriverSummary {
  driverId: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
  licenseNumber: string;
  vehicleNumber: string;
  profilePicture?: string;
  totalRides: number;
  totalEarnings: number;
  rating: number;
  lastRideDate?: Date;
  createdAt: Date;
  kycStatus?: string;
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
    stats: {
      totalRides: number;
      totalEarnings: number;
      rating: number;
      lastRideDate?: Date;
    };
  } | null>;
}
