import { BaseEntity } from "@shared/types/Repository";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { IQueryableRepository } from "./base/IQueryableRepository";
import { IBatchRepository } from "./base/IBatchRepository";
export interface IBaseRepository<T extends BaseEntity, ID = string> extends IReadOnlyRepository<T, ID>, IWriteOnlyRepository<T, ID>, IQueryableRepository<T, ID>, IBatchRepository<T> {
}
//# sourceMappingURL=IBaseRepository.d.ts.map