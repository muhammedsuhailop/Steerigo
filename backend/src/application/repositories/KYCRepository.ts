import {
  FilterOptions,
  QueryOptions,
  PaginatedResult,
} from "@shared/types/Repository";
import { KYC } from "@domain/entities/KYC";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";

export interface KYCQuery {
  status?: string;
  driverId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface KYCWithDriverInfo {
  kycRequest: KYC;
  driverInfo: {
    driverId: string;
    driverName: string;
    driverEmail: string;
    driverMobile: string;
  };
}

export interface KYCRepository
  extends ReadOnlyRepository<KYC>,
    QueryableRepository<KYC> {
  findKYCRequestsWithDriverInfo(
    filters: KYCQuery,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: KYCWithDriverInfo[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }>;

  findByDriverId(driverId: string): Promise<KYC | null>;

  updateKYCStatus(
    kycId: string,
    status: string,
    reviewedBy: string,
    comments?: string
  ): Promise<boolean>;

  findKYCWithDriverInfo(kycId: string): Promise<KYCWithDriverInfo | null>;
}
