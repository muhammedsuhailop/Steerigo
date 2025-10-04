import {
  BaseEntity,
  Repository,
  QueryOptions,
  PaginatedResult,
} from "@shared/types/Repository";

export interface BaseRepository<T extends BaseEntity> extends Repository<T> {
  findAll(options?: QueryOptions): Promise<T[]>;
  findPaginated(options: QueryOptions): Promise<PaginatedResult<T>>;
  count(filters?: Record<string, any>): Promise<number>;
  updateById(id: string, updates: Partial<T>): Promise<void>;
  deleteMany(filters: Record<string, any>): Promise<void>;
}
