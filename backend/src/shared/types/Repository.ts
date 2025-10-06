export interface BaseEntity {
  getId(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
}

export interface QueryOptions<T = any> {
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  filters?: Partial<T>;
}

export interface Repository<T extends BaseEntity, ID = string> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateOptions<T> {
  data: Partial<T>;
  validate?: boolean;
}

export type FilterOptions<T> = {
  [K in keyof T]?:
    | T[K]
    | T[K][]
    | {
        $in?: T[K][];
        $ne?: T[K];
        $regex?: string;
      };
};
