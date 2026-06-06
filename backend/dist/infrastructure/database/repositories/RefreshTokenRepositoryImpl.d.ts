import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { RefreshToken } from "../../../domain/entities/RefreshToken";
import { FilterOptions, QueryOptions, PaginatedResult } from "../../../shared/types/Repository";
export declare class RefreshTokenRepositoryImpl implements IRefreshTokenRepository {
    findByToken(token: string): Promise<RefreshToken | null>;
    findByUserId(userId: string): Promise<RefreshToken[]>;
    save(refreshToken: RefreshToken): Promise<RefreshToken>;
    deleteByToken(token: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    deleteExpiredTokens(): Promise<void>;
    findById(id: string): Promise<RefreshToken | null>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    findAll(options?: QueryOptions<RefreshToken>): Promise<RefreshToken[]>;
    findPaginated(options: QueryOptions<RefreshToken>): Promise<PaginatedResult<RefreshToken>>;
    count(filters?: FilterOptions<RefreshToken>): Promise<number>;
    updateById(id: string, updates: Partial<RefreshToken>): Promise<void>;
    deleteMany(filters: FilterOptions<RefreshToken>): Promise<number>;
    updateMany(filters: FilterOptions<RefreshToken>, updates: Partial<RefreshToken>): Promise<number>;
    findByIds(ids: string[]): Promise<RefreshToken[]>;
    existsByFilter(filters: FilterOptions<RefreshToken>): Promise<boolean>;
    private toDomain;
    private toPersistence;
}
//# sourceMappingURL=RefreshTokenRepositoryImpl.d.ts.map