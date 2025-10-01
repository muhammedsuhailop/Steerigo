import { PaginatedResult, PaginationOptions } from "./IAdminUserRepository";

export interface DriverFilters {
  status?: string;
  kycStatus?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DriverWithStats {
  driverId: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
  kycStatus: string;
  totalRides: number;
  totalEarned: number;
  lastRide?: string;
  joinedDate?: Date;
  isVerified?: boolean;
  licenseNumber: string;
  licenseExpiryDate: Date;
  eligibleVehicleType: string[];
  eligibleGearType: string[];
}

export interface DriverWithUser {
  driver: {
    _id: string;
    userId: string;
    licenseNumber: string;
    licenseIssueDate: Date;
    licenseExpiryDate: Date;
    licenseCategory: string[];
    kycStatus: string;
    status: string;
    eligibleVehicleType: string[];
    eligibleGearType: string[];
    createdAt: Date;
    updatedAt: Date;
    getStatus(): string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    status: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface IAdminDriverRepository {
  findDriversOnly(
    filters: DriverFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DriverWithStats>>;

  findDriverWithUser(driverId: string): Promise<DriverWithUser | null>;

  updateDriverStatus(
    driverId: string,
    status: string,
    reason?: string
  ): Promise<void>;
  getDriverStats(driverId: string): Promise<any>;
}
export { PaginationOptions, PaginatedResult };
