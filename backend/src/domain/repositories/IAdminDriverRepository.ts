import { Driver } from "@domain/entities/Driver";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";

export interface IAdminDriverQuery {
  status?: string;
  kycStatus?: string;
  licenceCategory?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IAdminDriverSummary {
  driverId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
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

export interface IAdminDriverRepository
  extends IReadOnlyRepository<Driver>,
    IQueryableRepository<Driver> {
  save(driver: Driver): Promise<Driver>;

  findDriversWithSummary(
    filters: IAdminDriverQuery,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: IAdminDriverSummary[];
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
      profilePicture?: string | undefined;
    };
    stats: {
      totalRides: number;
      totalEarnings: number;
      rating: number;
      lastRideDate?: Date;
    };
  } | null>;
}
