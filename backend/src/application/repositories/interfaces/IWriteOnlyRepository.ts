import { BaseEntity } from "@shared/types/Repository";

export interface IWriteOnlyRepository<T extends BaseEntity, ID = string> {
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}
