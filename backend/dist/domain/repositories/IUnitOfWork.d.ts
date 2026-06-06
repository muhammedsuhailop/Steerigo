export interface IUnitOfWork {
    runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=IUnitOfWork.d.ts.map