import { QueryOptions } from "@shared/types/Repository";
import { User } from "../entities/User";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";
import { IBatchRepository } from "./base/IBatchRepository";
import { AuthProvider } from "@shared/constants/AuthConstants";
export interface DateRange {
    from?: Date;
    to?: Date;
}
export interface UserStatsFilter {
    createdAt?: DateRange;
}
export interface IUserRepository extends IReadOnlyRepository<User>, IWriteOnlyRepository<User>, IQueryableRepository<User>, IBatchRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByEmailAndProvider(email: string, provider: AuthProvider): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    existsByMobile(mobile: string): Promise<boolean>;
    findByMobile(mobile: string): Promise<User | null>;
    findActiveUsers(options?: QueryOptions): Promise<User[]>;
    findByRole(role: string, options?: QueryOptions): Promise<User[]>;
    updateById(id: string, updates: Partial<Record<string, unknown>>): Promise<void>;
    countByUserStats(filter: UserStatsFilter): Promise<number>;
}
//# sourceMappingURL=IUserRepository.d.ts.map