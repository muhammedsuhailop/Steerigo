import {
  FilterOptions,
  QueryOptions,
  PaginatedResult,
} from "@shared/types/Repository";
import { KYC } from "@domain/entities/KYC";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";

export interface KYCQuery {
  verificationStatus?: string;
  docType?: string;
  driverId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface KYCWithDriverInfo {
  kycDocument: KYC;
  driverInfo: {
    driverId: string;
    userId: string;
    userName: string;
    userEmail: string;
    userMobile: string;
    driverStatus: string;
  };
}

export interface KYCRepository
  extends ReadOnlyRepository<KYC>,
    QueryableRepository<KYC> {
  findKYCDocumentsWithDriverInfo(
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

  findByDriverId(driverId: string): Promise<KYC[]>;

  findByDriverIdAndDocType(
    driverId: string,
    docType: string
  ): Promise<KYC | null>;

  updateVerificationStatus(
    kycId: string,
    status: string,
    comments?: string
  ): Promise<boolean>;

  findKYCWithDriverInfo(kycId: string): Promise<KYCWithDriverInfo | null>;
}
