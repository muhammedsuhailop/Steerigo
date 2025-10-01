export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface KycRequestWithDriver {
  kycId: string;
  driverId: string;
  driverName: string;
  docType: string;
  docNumber: string;
  issueDate: Date;
  expiryDate: Date;
  docImageUrls: string[];
  isVerified: boolean;
  comments?: string;
  createdAt: Date;
}
export interface KycRequestDetailed {
  kycId: string;
  driverId: string;
  driverName: string;
  driverEmail: string;
  docType: string;
  docNumber: string;
  issueDate: Date;
  expiryDate: Date;
  docImageUrls: string[];
  isVerified: boolean;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}

export interface IAdminKycRepository {
  findAllKycRequests(
    filters: {
      docType?: string;
      isVerified?: boolean;
      search?: string;
      dateFrom?: Date;
      dateTo?: Date;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
    pagination: PaginationOptions
  ): Promise<PaginatedResult<KycRequestWithDriver>>;

  updateKycStatus(
    kycId: string,
    isVerified: boolean,
    comments?: string
  ): Promise<void>;

  findKycRequestById(kycId: string): Promise<{
    kycId: string;
    driverId: string;
    docType: string;
    isVerified: boolean;
  } | null>;

  findKycRequestsByDriverId(
    driverId: string,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<KycRequestWithDriver>>;

  findKycRequestDetailedById(kycId: string): Promise<KycRequestDetailed | null>;
}
