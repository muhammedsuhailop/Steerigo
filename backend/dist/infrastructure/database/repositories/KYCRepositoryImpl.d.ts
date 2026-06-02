import { IKYCRepository } from "@domain/repositories/IKYCRepository";
import { IKYCRepository as IAdminKYCRepository } from "@domain/repositories/IAdminDriverKYCRepository";
import { KYC } from "@domain/entities/KYC";
import { FilterOptions, PaginatedResult, QueryOptions } from "@shared/types/Repository";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { IKYCQuery, IKYCWithDriverInfo } from "@domain/repositories/IAdminDriverKYCRepository";
type UnifiedKYCFilterOptions = FilterOptions<KYC> & IKYCQuery;
export declare class KYCRepositoryImpl implements IKYCRepository, IAdminKYCRepository {
    findById(id: string): Promise<KYC | null>;
    exists(id: string): Promise<boolean>;
    save(kyc: KYC): Promise<KYC>;
    delete(id: string): Promise<void>;
    findAll(options?: QueryOptions): Promise<KYC[]>;
    count(filters?: UnifiedKYCFilterOptions): Promise<number>;
    existsByFilter(filters: UnifiedKYCFilterOptions): Promise<boolean>;
    findByIds(ids: string[]): Promise<KYC[]>;
    findPaginated(options: QueryOptions<KYC> & {
        filters?: UnifiedKYCFilterOptions;
    }): Promise<PaginatedResult<KYC>>;
    updateMany(filters: FilterOptions<KYC>, updates: Partial<KYC>): Promise<number>;
    deleteMany(filters: FilterOptions<KYC>): Promise<number>;
    findByDriverId(driverId: string): Promise<KYC[]>;
    findByDriverAndDocType(driverId: string, docType: DocumentType): Promise<KYC | null>;
    findByDriverIdAndDocType(driverId: string, docType: string): Promise<KYC | null>;
    findByStatus(status: KYCStatus, options?: QueryOptions): Promise<KYC[]>;
    findPendingRequests(options?: QueryOptions): Promise<KYC[]>;
    existsByDriverAndDocType(driverId: string, docType: DocumentType): Promise<boolean>;
    countByStatus(status: KYCStatus): Promise<number>;
    findExpiredDocuments(): Promise<KYC[]>;
    findKYCDocumentsWithDriverInfo(filters: IKYCQuery, pagination: {
        page: number;
        pageSize: number;
    }): Promise<{
        data: IKYCWithDriverInfo[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    updateVerificationStatus(kycId: string, status: string, comments?: string): Promise<boolean>;
    findKYCWithDriverInfo(kycId: string): Promise<IKYCWithDriverInfo | null>;
    private buildFilterQuery;
}
export {};
//# sourceMappingURL=KYCRepositoryImpl.d.ts.map