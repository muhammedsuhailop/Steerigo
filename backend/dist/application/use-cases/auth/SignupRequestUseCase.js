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
exports.SignupRequestUseCase = void 0;
const inversify_1 = require("inversify");
const User_1 = require("@domain/entities/User");
const errors_1 = require("@domain/errors");
const Result_1 = require("@shared/utils/Result");
const uuid_1 = require("uuid");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const Password_1 = require("@domain/value-objects/Password");
let SignupRequestUseCase = class SignupRequestUseCase {
    constructor(userRepository, passwordService, emailService, otpService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.emailService = emailService;
        this.otpService = otpService;
    }
    async execute(dto) {
        try {
            const existingUser = await this.userRepository.findByEmail(dto.getEmailValue());
            const existingMobileUser = await this.userRepository.findByMobile(dto.getMobile());
            let user;
            if (existingUser && existingUser.getIsVerified()) {
                return Result_1.Result.failure(new errors_1.UserAlreadyExistsError("Email already registered"));
            }
            if (existingMobileUser && existingMobileUser.getIsVerified()) {
                return Result_1.Result.failure(new errors_1.UserAlreadyExistsError("Mobile number already registered"));
            }
            if (existingUser && !existingUser.getIsVerified()) {
                user = existingUser;
                const passwordHash = await this.passwordService.hash(dto.getPassword());
                user.updatePassword(Password_1.Password.createFromHash(passwordHash));
                Logger_1.Logger.info("Updating existing unverified user", {
                    email: dto.getEmailValue(),
                    userId: user.getId(),
                });
            }
            else {
                user = User_1.User.create({
                    id: (0, uuid_1.v4)(),
                    name: dto.getName(),
                    email: dto.getEmailValue(),
                    password: dto.getPassword(),
                    mobile: dto.getMobile(),
                    role: dto.getRole(),
                });
                const passwordHash = await this.passwordService.hash(dto.getPassword());
                user.updatePassword(Password_1.Password.createFromHash(passwordHash));
                Logger_1.Logger.info("Creating new user", {
                    email: dto.getEmailValue(),
                    userId: user.getId(),
                });
            }
            const otp = this.otpService.generate();
            const otpHash = await this.otpService.hash(otp);
            const otpExpires = new Date(Date.now() + parseInt(process.env.OTP_TTL_SECONDS || "300") * 1000);
            user.setOtpDetails(otpHash, otpExpires);
            await this.userRepository.save(user);
            Logger_1.Logger.info("OTP Generated:", otp); // DEV ONLY
            Logger_1.Logger.info("OTP expires at:", otpExpires); // DEV ONLY
            await this.emailService.sendVerificationOtp(dto.getEmailValue(), otp, user.getName());
            return Result_1.Result.success();
        }
        catch (error) {
            return Result_1.Result.failure(error);
        }
    }
};
exports.SignupRequestUseCase = SignupRequestUseCase;
exports.SignupRequestUseCase = SignupRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.PasswordService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EmailService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.OtpService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], SignupRequestUseCase);
//# sourceMappingURL=SignupRequestUseCase.js.map