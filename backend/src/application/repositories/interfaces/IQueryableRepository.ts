import {
  BaseEntity,
  QueryOptions,
  PaginatedResult,
  FilterOptions,
} from "@shared/types/Repository";

export interface IQueryableRepository<T extends BaseEntity, ID = string> {
  findAll(options?: QueryOptions<T>): Promise<T[]>;
  findPaginated(options: QueryOptions<T>): Promise<PaginatedResult<T>>;
  count(filters?: FilterOptions<T>): Promise<number>;
  existsByFilter(filters: FilterOptions<T>): Promise<boolean>;
  findByIds(ids: ID[]): Promise<T[]>;
}
