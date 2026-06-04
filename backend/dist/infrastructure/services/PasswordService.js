"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const inversify_1 = require("inversify");
const AppConstants_1 = require("../../shared/constants/AppConstants");
const Logger_1 = require("../../shared/utils/Logger");
const DITypes_1 = require("../../shared/constants/DITypes");
let PasswordService = class PasswordService {
    constructor(cryptoAdapter) {
        this.cryptoAdapter = cryptoAdapter;
    }
    async hash(password) {
        try {
            if (!password) {
                throw new Error("Password cannot be empty");
            }
            const hashedPassword = await this.cryptoAdapter.hash(password, AppConstants_1.AppConstants.BCRYPT_ROUNDS);
            Logger_1.Logger.debug("Password hashed successfully");
            return hashedPassword;
        }
        catch (error) {
            Logger_1.Logger.error("Error hashing password", error);
            throw new Error("Failed to hash password");
        }
    }
    async compare(password, hashedPassword) {
        try {
            if (!password || !hashedPassword) {
                return false;
            }
            const isMatch = await this.cryptoAdapter.compare(password, hashedPassword);
            Logger_1.Logger.debug("Password comparison completed", { isMatch });
            return isMatch;
        }
        catch (error) {
            Logger_1.Logger.error("Error comparing password", error);
            return false;
        }
    }
    generateTemporaryPassword() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
        let password = "";
        // Ensure at least one character from each required category
        password += this.getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"); // uppercase
        password += this.getRandomChar("abcdefghijklmnopqrstuvwxyz"); // lowercase
        password += this.getRandomChar("0123456789"); // number
        password += this.getRandomChar("@$!%*?&"); // special char
        // Fill the rest randomly
        for (let i = password.length; i < 12; i++) {
            password += this.getRandomChar(chars);
        }
        // Shuffle the password
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    }
    validatePasswordStrength(password) {
        if (!password || password.length < 8)
            return false;
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);
        return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
    }
    getRandomChar(chars) {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CryptoAdapter)),
    __metadata("design:paramtypes", [Object])
], PasswordService);
//# sourceMappingURL=PasswordService.js.map