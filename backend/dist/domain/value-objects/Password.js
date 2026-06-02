"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const DomainError_1 = require("../errors/DomainError");
class Password {
    constructor(hashedValue) {
        this.hashedValue = hashedValue;
    }
    static createFromPlainText(plainText) {
        if (!plainText) {
            throw new DomainError_1.DomainError("Password is required");
        }
        if (plainText.length < 8) {
            throw new DomainError_1.DomainError("Password must be at least 8 characters long");
        }
        if (plainText.length > 128) {
            throw new DomainError_1.DomainError("Password must be less than 128 characters");
        }
        if (!this.isStrongPassword(plainText)) {
            throw new DomainError_1.DomainError("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character");
        }
        // will be hashed in application layer
        return new Password(plainText);
    }
    static createFromHash(hashedValue) {
        if (!hashedValue) {
            throw new DomainError_1.DomainError("Hashed password cannot be empty");
        }
        return new Password(hashedValue);
    }
    static createEmpty() {
        return new Password("DUMMY_HASH_ALLOWED_EMPTY_HASH");
    }
    static isStrongPassword(password) {
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);
        return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
    }
    getHashedValue() {
        return this.hashedValue;
    }
    isHashed() {
        return this.hashedValue.length >= 60 && this.hashedValue.startsWith("$");
    }
}
exports.Password = Password;
//# sourceMappingURL=Password.js.map