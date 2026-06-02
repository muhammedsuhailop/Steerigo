import { BaseEntity, FilterOptions } from "@shared/types/Repository";
export interface IBatchRepository<T extends BaseEntity> {
    updateMany(filters: FilterOptions<T>, updates: Partial<T>): Promise<number>;
    deleteMany(filters: FilterOptions<T>): Promise<number>;
}
//# sourceMappingURL=IBatchRepository.d.ts.map