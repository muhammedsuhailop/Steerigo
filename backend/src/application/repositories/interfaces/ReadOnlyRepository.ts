import { BaseEntity } from "@shared/types/Repository";

export interface ReadOnlyRepository<T extends BaseEntity, ID = string> {
  findById(id: ID): Promise<T | null>;
  exists(id: ID): Promise<boolean>;
}
