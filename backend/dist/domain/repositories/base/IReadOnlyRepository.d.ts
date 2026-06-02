import { BaseEntity } from "@shared/types/Repository";
export interface IReadOnlyRepository<T extends BaseEntity, ID = string> {
    findById(id: ID): Promise<T | null>;
    exists(id: ID): Promise<boolean>;
}
//# sourceMappingURL=IReadOnlyRepository.d.ts.map