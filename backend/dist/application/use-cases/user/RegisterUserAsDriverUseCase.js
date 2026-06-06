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
exports.RegisterUserAsDriverUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
let RegisterUserAsDriverUseCase = class RegisterUserAsDriverUseCase {
    constructor(userRepository, driverRepository) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Register user as driver started", { userId: dto.userId });
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new DomainError_1.DomainError(validationErrors.join(", ")));
            }
            const user = await this.userRepository.findById(dto.userId);
            if (!user) {
                return Result_1.Result.failure(new DomainError_1.DomainError("User not found"));
            }
            if (!user.getIsVerified()) {
                return Result_1.Result.failure(new DomainError_1.DomainError("User account must be verified before registering as driver"));
            }
            const currentRole = user.getRole();
            if (currentRole === "Driver") {
                return Result_1.Result.failure(new DomainError_1.DomainError("User is already registered as a driver"));
            }
            if (currentRole === "Admin") {
                return Result_1.Result.failure(new DomainError_1.DomainError("Admin users cannot register as drivers"));
            }
            const existingDriver = await this.driverRepository.findByUserId(dto.userId);
            if (existingDriver) {
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver profile already exists for this user"));
            }
            user.updateRole("Driver");
            await this.userRepository.save(user);
            const response = {
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail().getValue(),
                mobile: user.getMobile(),
                role: user.getRole(),
                status: user.getStatus(),
                isVerified: user.getIsVerified(),
                updatedAt: user.getUpdatedAt().toISOString(),
                message: "Successfully registered as driver. Please complete your driver profile and submit required documents.",
            };
            Logger_1.Logger.info("User registered as driver successfully", {
                userId: dto.userId,
                previousRole: currentRole,
                newRole: "Driver",
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Register user as driver failed", {
                userId: dto.userId,
                error,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.RegisterUserAsDriverUseCase = RegisterUserAsDriverUseCase;
exports.RegisterUserAsDriverUseCase = RegisterUserAsDriverUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object])
], RegisterUserAsDriverUseCase);
//# sourceMappingURL=RegisterUserAsDriverUseCase.js.map