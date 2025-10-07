import { BaseEntity } from "@shared/types/Repository";
import { ReadOnlyRepository } from "./interfaces/ReadOnlyRepository";
import { WriteOnlyRepository } from "./interfaces/WriteOnlyRepository";
import { QueryableRepository } from "./interfaces/QueryableRepository";
import { BatchRepository } from "./interfaces/BatchRepository";

export interface BaseRepository<T extends BaseEntity, ID = string>
  extends ReadOnlyRepository<T, ID>,
    WriteOnlyRepository<T, ID>,
    QueryableRepository<T, ID>,
    BatchRepository<T> {}
