import { BaseEntity } from "@shared/types/Repository";
import { IReadOnlyRepository } from "./interfaces/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./interfaces/IWriteOnlyRepository";
import { IQueryableRepository } from "./interfaces/IQueryableRepository";
import { IBatchRepository } from "./interfaces/IBatchRepository";

export interface IBaseRepository<T extends BaseEntity, ID = string>
  extends IReadOnlyRepository<T, ID>,
    IWriteOnlyRepository<T, ID>,
    IQueryableRepository<T, ID>,
    IBatchRepository<T> {}
