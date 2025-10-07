import { BaseEntity } from "@shared/types/Repository";

export interface WriteOnlyRepository<T extends BaseEntity, ID = string> {
  save(entity: T): Promise<void>;
  delete(id: ID): Promise<void>;
}
