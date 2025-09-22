export class Result<T, E = Error> {
  private constructor(
    private readonly isSuccess: boolean,
    private readonly error?: E,
    private readonly value?: T
  ) {}

  static success<T, E = Error>(value?: T): Result<T, E> {
    return new Result<T, E>(true, undefined, value);
  }

  static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, error);
  }

  isSuccessful(): boolean {
    return this.isSuccess;
  }

  isFailure(): boolean {
    return !this.isSuccess;
  }

  getError(): E {
    if (this.isSuccess) {
      throw new Error("Cannot get error from successful result");
    }
    return this.error!;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Cannot get value from failed result");
    }
    return this.value!;
  }
}
