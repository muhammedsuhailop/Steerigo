export class Result<T> {
    private constructor(
        private readonly isSuccess: boolean,
        private readonly error?: Error,
        private readonly value?: T
    ) { }

    static success<T>(value?: T): Result<T> {
        return new Result<T>(true, undefined, value);
    }

    static failure<T>(error: Error): Result<T> {
        return new Result<T>(false, error);
    }

    isSuccessful(): boolean {
        return this.isSuccess;
    }

    isFailure(): boolean {
        return !this.isSuccess;
    }

    getError(): Error {
        if (this.isSuccess) {
            throw new Error('Cannot get error from successful result');
        }
        return this.error!;
    }

    getValue(): T {
        if (!this.isSuccess) {
            throw new Error('Cannot get value from failed result');
        }
        return this.value!;
    }
}
