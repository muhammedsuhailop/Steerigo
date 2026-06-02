"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const inversify_1 = require("inversify");
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppConstants_1 = require("@shared/constants/AppConstants");
const Logger_1 = require("@shared/utils/Logger");
let OtpService = class OtpService {
    generate() {
        try {
            const otp = otp_generator_1.default.generate(AppConstants_1.AppConstants.OTP_LENGTH, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });
            Logger_1.Logger.debug("OTP generated successfully");
            return otp;
        }
        catch (error) {
            Logger_1.Logger.error("Error generating OTP", error);
            throw new Error("Failed to generate OTP");
        }
    }
    async hash(otp) {
        try {
            const hashedOtp = await bcrypt_1.default.hash(otp, AppConstants_1.AppConstants.BCRYPT_ROUNDS);
            Logger_1.Logger.debug("OTP hashed successfully");
            return hashedOtp;
        }
        catch (error) {
            Logger_1.Logger.error("Error hashing OTP", error);
            throw new Error("Failed to hash OTP");
        }
    }
    async verify(otp, hashedOtp) {
        try {
            const isValid = await bcrypt_1.default.compare(otp, hashedOtp);
            Logger_1.Logger.debug("OTP verification completed", { isValid });
            return isValid;
        }
        catch (error) {
            Logger_1.Logger.error("Error verifying OTP", error);
            throw new Error("Failed to verify OTP");
        }
    }
    isExpired(createdAt, ttlSeconds = AppConstants_1.AppConstants.OTP_TTL_SECONDS) {
        const expiryTime = new Date(createdAt.getTime() + ttlSeconds * 1000);
        return new Date() > expiryTime;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, inversify_1.injectable)()
], OtpService);
//# sourceMappingURL=OtpService.js.map