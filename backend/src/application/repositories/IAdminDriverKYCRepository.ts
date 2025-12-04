import {
  FilterOptions,
  QueryOptions,
  PaginatedResult,
} from "@shared/types/Repository";
import { KYC } from "@domain/entities/KYC";
import { IReadOnlyRepository } from "./interfaces/IReadOnlyRepository";
import { IQueryableRepository } from "./interfaces/IQueryableRepository";

export interface IKYCQuery {
  verificationStatus?: string;
  docType?: string;
  driverId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IKYCWithDriverInfo {
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

export interface IKYCRepository
  extends IReadOnlyRepository<KYC>,
    IQueryableRepository<KYC> {
  findKYCDocumentsWithDriverInfo(
    filters: IKYCQuery,
    pagination: { page: number; pageSize: number }
  ): Promise<{
    data: IKYCWithDriverInfo[];
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

  findKYCWithDriverInfo(kycId: string): Promise<IKYCWithDriverInfo | null>;
}
