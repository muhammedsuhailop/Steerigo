import { IUserRepository, UserStatsFilter } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { AuthProvider } from "../../../shared/constants/AuthConstants";
import { QueryOptions, PaginatedResult, FilterOptions } from "../../../shared/types/Repository";
export declare class UserRepositoryImpl implements IUserRepository {
    private queryService;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailAndProvider(email: string, provider: AuthProvider): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    existsByMobile(mobile: string): Promise<boolean>;
    findActiveUsers(options?: QueryOptions): Promise<User[]>;
    findByRole(role: string, options?: QueryOptions): Promise<User[]>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    updateById(id: string, updates: Partial<User>): Promise<void>;
    exists(id: string): Promise<boolean>;
    existsByFilter(filters: FilterOptions<User>): Promise<boolean>;
    findAll(options?: QueryOptions): Promise<User[]>;
    findPaginated(options: QueryOptions): Promise<PaginatedResult<User>>;
    count(filters?: FilterOptions<User>): Promise<number>;
    updateMany(filters: FilterOptions<User>, updates: Partial<User>): Promise<number>;
    deleteMany(filters: FilterOptions<User>): Promise<number>;
    findByIds(ids: string[]): Promise<User[]>;
    countByUserStats(filter: UserStatsFilter): Promise<number>;
}
//# sourceMappingURL=UserRepositoryImpl.d.ts.map