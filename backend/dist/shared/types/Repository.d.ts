export interface BaseEntity {
    getId(): string;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}
export interface QueryOptions<T = unknown> {
    page?: number;
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
type ComparisonOperators<T> = {
    $eq?: T;
    $ne?: T;
    $in?: T[];
};
type RangeOperators<T> = T extends Date | number ? {
    $gt?: T;
    $gte?: T;
    $lt?: T;
    $lte?: T;
} : Record<string, never>;
type StringOperators<T> = T extends string ? {
    $regex?: string;
} : Record<string, never>;
export type FilterOptions<T> = {
    [K in keyof T]?: T[K] | T[K][] | (ComparisonOperators<T[K]> & RangeOperators<T[K]> & StringOperators<T[K]>);
};
export {};
//# sourceMappingURL=Repository.d.ts.map