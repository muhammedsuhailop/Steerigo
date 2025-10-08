// Domain entity with metadata getters 
export interface BaseEntity {
  getId(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
}

// Pagination and filtering options 
export interface QueryOptions<T = any> {
  page?:number;
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  filters?: Partial<T>;
}

// Generic CRUD operations 
export interface Repository<T extends BaseEntity, ID = string> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}

// Result of a paginated query 
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Bulk update options 
export interface UpdateOptions<T> {
  data: Partial<T>;
  validate?: boolean;
}

// Flexible filter definitions 
export type FilterOptions<T> = {
  [K in keyof T]?:
    | T[K]
    | T[K][]
    | { $in?: T[K][]; $ne?: T[K]; $regex?: string };
};
