"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const DomainError_1 = require("../errors/DomainError");
class Email {
    constructor(value) {
        this.value = value;
    }
    static create(email) {
        if (!email) {
            throw new DomainError_1.DomainError("Email is required");
        }
        const trimmedEmail = email.trim();
        if (!this.isValid(trimmedEmail)) {
            throw new DomainError_1.DomainError("Invalid email format");
        }
        if (trimmedEmail.length > 255) {
            throw new DomainError_1.DomainError("Email must be less than 255 characters");
        }
        return new Email(trimmedEmail.toLowerCase());
    }
    static isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map