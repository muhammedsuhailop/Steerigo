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
exports.UpdateUserProfileUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
let UpdateUserProfileUseCase = class UpdateUserProfileUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Update user profile started", { userId: dto.userId });
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new DomainError_1.DomainError(validationErrors.join(", ")));
            }
            if (!dto.hasUpdates()) {
                return Result_1.Result.failure(new DomainError_1.DomainError("No updates provided"));
            }
            const user = await this.userRepository.findById(dto.userId);
            if (!user) {
                return Result_1.Result.failure(new DomainError_1.DomainError("User not found"));
            }
            if (!user.getIsVerified()) {
                return Result_1.Result.failure(new DomainError_1.DomainError("User account not verified"));
            }
            const updatedFields = [];
            // Check mobile uniqueness if mobile is being updated
            if (dto.mobile && dto.mobile !== user.getMobile()) {
                const mobileExists = await this.userRepository.existsByMobile(dto.mobile);
                if (mobileExists) {
                    return Result_1.Result.failure(new DomainError_1.DomainError("Mobile number already registered"));
                }
            }
            // Update user profile
            const profileUpdates = dto.getUserProfileUpdates();
            if (Object.keys(profileUpdates).length > 0) {
                user.updateProfile(profileUpdates);
                await this.userRepository.save(user);
                updatedFields.push(...Object.keys(profileUpdates));
                Logger_1.Logger.info("User profile updated", {
                    userId: dto.userId,
                    updates: Object.keys(profileUpdates),
                });
            }
            const updatedUser = await this.userRepository.findById(dto.userId);
            if (!updatedUser) {
                return Result_1.Result.failure(new DomainError_1.DomainError("Failed to retrieve updated user"));
            }
            const response = {
                user: {
                    id: updatedUser.getId(),
                    name: updatedUser.getName(),
                    email: updatedUser.getEmail().getValue(),
                    mobile: updatedUser.getMobile(),
                    dob: updatedUser.getDob()?.toISOString(),
                    gender: updatedUser.getGender(),
                    address: updatedUser.getAddress(),
                    role: updatedUser.getRole(),
                    status: updatedUser.getStatus(),
                    isVerified: updatedUser.getIsVerified(),
                    profilePicture: updatedUser.getProfilePicture(),
                    authProvider: updatedUser.getAuthProvider(),
                    createdAt: updatedUser.getCreatedAt().toISOString(),
                    updatedAt: updatedUser.getUpdatedAt().toISOString(),
                },
                updatedFields,
            };
            Logger_1.Logger.info("User profile update successful", {
                userId: dto.userId,
                updatedFields,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Update user profile failed", { userId: dto.userId, error });
            return Result_1.Result.failure(error);
        }
    }
};
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object])
], UpdateUserProfileUseCase);
//# sourceMappingURL=UpdateUserProfileUseCase.js.map