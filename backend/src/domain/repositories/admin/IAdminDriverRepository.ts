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

export interface IAdminDriverRepository {
  findDriversOnly(
    filters: DriverFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DriverWithStats>>;
  updateDriverStatus(
    driverId: string,
    status: string,
    reason?: string
  ): Promise<void>;
  getDriverStats(driverId: string): Promise<any>;
}
export { PaginationOptions, PaginatedResult };
