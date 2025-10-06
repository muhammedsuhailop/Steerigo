import {
  BaseEntity,
  Repository,
  QueryOptions,
  PaginatedResult,
  FilterOptions,
} from "@shared/types/Repository";

export interface BaseRepository<T extends BaseEntity, ID = string>
  extends Repository<T, ID> {
  // Query operations
  findAll(options?: QueryOptions<T>): Promise<T[]>;
  findPaginated(options: QueryOptions<T>): Promise<PaginatedResult<T>>;

  // Count operations
  count(filters?: FilterOptions<T>): Promise<number>;

  // Update operations
  updateById(id: ID, updates: Partial<T>): Promise<void>;
  updateMany(filters: FilterOptions<T>, updates: Partial<T>): Promise<number>;

  // Delete operations
  deleteMany(filters: FilterOptions<T>): Promise<number>;

  // Utility operations
  findByIds(ids: ID[]): Promise<T[]>;
  existsByFilter(filters: FilterOptions<T>): Promise<boolean>;
}
