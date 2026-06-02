"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    constructor(isSuccess, error, value) {
        this.isSuccess = isSuccess;
        this.error = error;
        this.value = value;
    }
    static success(value) {
        return new Result(true, undefined, value);
    }
    static failure(error) {
        return new Result(false, error);
    }
    isSuccessful() {
        return this.isSuccess;
    }
    isFailure() {
        return !this.isSuccess;
    }
    getError() {
        if (this.isSuccess) {
            throw new Error("Cannot get error from successful result");
        }
        return this.error;
    }
    getValue() {
        if (!this.isSuccess) {
            throw new Error("Cannot get value from failed result");
        }
        return this.value;
    }
}
exports.Result = Result;
//# sourceMappingURL=Result.js.map