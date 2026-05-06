import { QueryOptions } from "@shared/types/Repository";
import { Driver } from "@domain/entities/Driver";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";
import { IBatchRepository } from "./base/IBatchRepository";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";

export interface IDriverDateRangeFilter {
  fromDate: Date;
  toDate: Date;
}

export interface IDriverRepository
  extends IReadOnlyRepository<Driver, string>,
    IWriteOnlyRepository<Driver, string>,
    IQueryableRepository<Driver>,
    IBatchRepository<Driver> {
  // Driver-specific query methods
  findByUserId(userId: string): Promise<Driver | null>;
  existsByUserId(userId: string): Promise<boolean>;
  findByStatus(status: DriverStatus, options?: QueryOptions): Promise<Driver[]>;
  findByKycStatus(
    kycStatus: KYCStatus,
    options?: QueryOptions,
  ): Promise<Driver[]>;
  findByLicenseCategory(
    category: LicenseCategory,
    options?: QueryOptions,
  ): Promise<Driver[]>;
  findActiveDrivers(options?: QueryOptions): Promise<Driver[]>;
  countByStatus(status: DriverStatus): Promise<number>;
  countByKycStatus(kycStatus: KYCStatus): Promise<number>;
  countNewDrivers(filter: IDriverDateRangeFilter): Promise<number>;
}
