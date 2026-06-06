import { IUnitOfWork } from "../../../domain/repositories/IUnitOfWork";
export declare class MongoUnitOfWork implements IUnitOfWork {
    runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=MongoUnitOfWork.d.ts.map