import { IUserDocument } from "../models/UserModel";
import { QueryOptions, FilterOptions } from "../../../shared/types/Repository";
import { AuthProvider } from "../../../shared/constants/AuthConstants";
import { User } from "../../../domain/entities";
export declare class UserQueryService {
    findById(id: string): Promise<IUserDocument | null>;
    findByEmail(email: string): Promise<IUserDocument | null>;
    findByEmailAndProvider(email: string, provider: AuthProvider): Promise<IUserDocument | null>;
    findByGoogleId(googleId: string): Promise<IUserDocument | null>;
    findByMobile(mobile: string): Promise<IUserDocument | null>;
    findAll(options?: QueryOptions): Promise<IUserDocument[]>;
    findActiveUsers(options?: QueryOptions): Promise<IUserDocument[]>;
    findByRole(role: string, options?: QueryOptions): Promise<IUserDocument[]>;
    count(filters?: FilterOptions<User>): Promise<number>;
    existsByEmail(email: string): Promise<boolean>;
    existsByMobile(mobile: string): Promise<boolean>;
    exists(id: string): Promise<boolean>;
    existsByFilter(filters: FilterOptions<User>): Promise<boolean>;
}
//# sourceMappingURL=UserQueryService.d.ts.map