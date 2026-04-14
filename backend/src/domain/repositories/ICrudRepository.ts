import { BaseEntity } from "@shared/types/Repository";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";

export interface ICrudRepository<T extends BaseEntity, ID = string>
  extends IReadOnlyRepository<T, ID>,
    IWriteOnlyRepository<T, ID> {}
