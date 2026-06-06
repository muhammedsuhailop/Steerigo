export declare class Result<T, E = Error> {
    private readonly isSuccess;
    private readonly error?;
    private readonly value?;
    private constructor();
    static success<T, E = Error>(value?: T): Result<T, E>;
    static failure<T, E = Error>(error: E): Result<T, E>;
    isSuccessful(): boolean;
    isFailure(): boolean;
    getError(): E;
    getValue(): T;
}
//# sourceMappingURL=Result.d.ts.map