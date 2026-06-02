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
exports.GetUserProfileDetailsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const DomainError_1 = require("@domain/errors/DomainError");
let GetUserProfileDetailsUseCase = class GetUserProfileDetailsUseCase {
    constructor(userRepository, rideRepository) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Executing GetUserProfileUseCase", {
                userId: dto.getUserId(),
            });
            const userId = dto.getUserId();
            const user = (await this.userRepository.findById(userId));
            if (!user) {
                Logger_1.Logger.warn("User profile not found", {
                    userId: userId,
                });
                return Result_1.Result.failure(new DomainError_1.DomainError("User not found"));
            }
            const [rideStats, lastRide] = await Promise.all([
                this.rideRepository.countByRiderStats(userId, {
                    fromDate: undefined,
                    toDate: undefined,
                }),
                this.rideRepository.findLatestByRiderId(userId),
            ]);
            const userInfo = {
                id: user.getId(),
                name: user.getName(),
                email: user.getEmailValue(),
                mobile: user.getMobile(),
                profilePicture: user.getProfilePicture(),
                status: user.getStatus(),
                role: user.getRole(),
                isVerified: user.getIsVerified(),
                authProvider: user.getAuthProvider(),
                address: user.getAddress(),
                dob: user.getDob(),
                gender: user.getGender(),
                createdAt: user.getCreatedAt(),
                updatedAt: user.getUpdatedAt(),
            };
            const accountStats = {
                totalBookings: rideStats.total,
                totalSpent: rideStats.totalSpend,
                lastBookingDate: lastRide ? lastRide.getCreatedAt() : null,
                joinedDaysAgo: this.calculateJoinedDaysAgo(user.getCreatedAt()),
            };
            const isActive = user.getStatus().toString() === "ACTIVE";
            const activityStatus = {
                isActive,
                lastLoginDate: null,
            };
            const metadata = {
                hasCompletedProfile: this.isProfileComplete(user),
                documentVerificationStatus: undefined,
            };
            const response = {
                userInfo,
                accountStats,
                activityStatus,
                metadata,
            };
            Logger_1.Logger.info("Admin user profile fetched successfully", {
                userId: dto.getUserId(),
                userRole: user.getRole(),
                userStatus: user.getStatus(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin user profile", {
                userId: dto.getUserId(),
                error,
            });
            return Result_1.Result.failure(error instanceof DomainError_1.DomainError
                ? error
                : new DomainError_1.DomainError("Failed to fetch user profile"));
        }
    }
    calculateJoinedDaysAgo(createdAt) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createdAt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    isProfileComplete(user) {
        return !!(user.getName() &&
            user.getEmailValue() &&
            user.getMobile() &&
            user.getAddress() &&
            user.getDob() &&
            user.getGender() &&
            user.getProfilePicture());
    }
};
exports.GetUserProfileDetailsUseCase = GetUserProfileDetailsUseCase;
exports.GetUserProfileDetailsUseCase = GetUserProfileDetailsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetUserProfileDetailsUseCase);
//# sourceMappingURL=GetUserProfileDetailsUseCase.js.map