import { IDriverDateRangeFilter, IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IAdminDriverRepository } from "../../../domain/repositories/IAdminDriverRepository";
import { Driver } from "../../../domain/entities/Driver";
import { FilterOptions, PaginatedResult, QueryOptions } from "../../../shared/types/Repository";
import { DriverStatus } from "../../../domain/value-objects/DriverStatus";
import { KYCStatus } from "../../../domain/value-objects/KYCStatus";
import { LicenseCategory } from "../../../domain/value-objects/LicenseCategory";
import { IAdminDriverQuery, IAdminDriverSummary } from "../../../domain/repositories/IAdminDriverRepository";
type UnifiedDriverFilterOptions = FilterOptions<Driver> & IAdminDriverQuery;
export declare class DriverRepositoryImpl implements IDriverRepository, IAdminDriverRepository {
    findById(id: string): Promise<Driver | null>;
    exists(id: string): Promise<boolean>;
    save(driver: Driver): Promise<Driver>;
    delete(id: string): Promise<void>;
    findAll(options?: QueryOptions): Promise<Driver[]>;
    count(filters?: UnifiedDriverFilterOptions): Promise<number>;
    existsByFilter(filters: UnifiedDriverFilterOptions): Promise<boolean>;
    findByIds(ids: string[]): Promise<Driver[]>;
    findPaginated(options: QueryOptions<Driver> & {
        filters?: UnifiedDriverFilterOptions;
    }): Promise<PaginatedResult<Driver>>;
    updateMany(filters: FilterOptions<Driver>, updates: Partial<Driver>): Promise<number>;
    deleteMany(filters: FilterOptions<Driver>): Promise<number>;
    findByUserId(userId: string): Promise<Driver | null>;
    existsByUserId(userId: string): Promise<boolean>;
    findByStatus(status: DriverStatus, options?: QueryOptions): Promise<Driver[]>;
    findByKycStatus(kycStatus: KYCStatus, options?: QueryOptions): Promise<Driver[]>;
    findByLicenseCategory(category: LicenseCategory, options?: QueryOptions): Promise<Driver[]>;
    findActiveDrivers(options?: QueryOptions): Promise<Driver[]>;
    countByStatus(status: DriverStatus): Promise<number>;
    countByKycStatus(kycStatus: KYCStatus): Promise<number>;
    findDriversWithSummary(filters: IAdminDriverQuery, pagination: {
        page: number;
        pageSize: number;
    }, sortBy?: string, sortOrder?: "asc" | "desc"): Promise<{
        data: IAdminDriverSummary[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    updateDriverStatus(driverId: string, status: string, reason?: string): Promise<boolean>;
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
            profilePicture: string;
        };
        stats: {
            totalRides: number;
            totalEarnings: number;
            rating: number;
            lastRideDate?: Date;
        };
    } | null>;
    countNewDrivers(filter: IDriverDateRangeFilter): Promise<number>;
    private buildFilterQuery;
    private buildSortQuery;
}
export {};
//# sourceMappingURL=DriverRepositoryImpl.d.ts.map