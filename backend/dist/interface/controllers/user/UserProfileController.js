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
exports.UserProfileController = void 0;
const inversify_1 = require("inversify");
const GetUserProfileDto_1 = require("../../../application/dto/user/GetUserProfileDto");
const UpdateUserProfileDto_1 = require("../../../application/dto/user/UpdateUserProfileDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const user_1 = require("../../../application/dto/user");
const UserMessages_1 = require("../../../shared/constants/UserMessages");
const GetUserStatsRequestDto_1 = require("../../../application/dto/user/GetUserStatsRequestDto");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
let UserProfileController = class UserProfileController {
    constructor(getUserProfileUseCase, updateUserProfileUseCase, registerUserAsDriverUseCase, getUserStatsUseCase) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.registerUserAsDriverUseCase = registerUserAsDriverUseCase;
        this.getUserStatsUseCase = getUserStatsUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async getProfile(req, res) {
        try {
            const userId = this.getUserId(req);
            const dto = GetUserProfileDto_1.GetUserProfileDto.fromRequest(userId);
            const result = await this.getUserProfileUseCase.execute(dto);
            if (result.isSuccessful()) {
                const response = {
                    success: true,
                    message: UserMessages_1.USER_MESSAGES.PROFILE.PROFILE_FETCHED,
                    data: result.getValue(),
                };
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: result.getError().message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Get user profile controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: UserMessages_1.USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = this.getUserId(req);
            const body = req.body;
            const dto = UpdateUserProfileDto_1.UpdateUserProfileDto.fromRequest(userId, body);
            const result = await this.updateUserProfileUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                const response = {
                    success: true,
                    message: UserMessages_1.USER_MESSAGES.PROFILE.PROFILE_UPDATED,
                    data: responseData.user,
                };
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: result.getError().message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Update user profile controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: UserMessages_1.USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async registerAsDriver(req, res) {
        try {
            const userId = this.getUserId(req);
            const dto = user_1.RegisterAsDriverRequestDto.fromRequest(userId);
            const result = await this.registerUserAsDriverUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                const response = {
                    success: true,
                    message: responseData.message,
                    data: {
                        id: responseData.id,
                        name: responseData.name,
                        email: responseData.email,
                        mobile: responseData.mobile,
                        role: responseData.role,
                        status: responseData.status,
                        isVerified: responseData.isVerified,
                        updatedAt: responseData.updatedAt,
                    },
                };
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: result.getError().message,
                });
            }
            Logger_1.Logger.info("Register as driver request processed", {
                userId,
                success: result.isSuccessful(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Register as driver controller error", {
                error,
                userId: req.params.userId,
                currentUserId: this.getUserId(req),
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: UserMessages_1.USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async getMyStats(req, res) {
        try {
            const userId = req.user.userId;
            const dto = GetUserStatsRequestDto_1.GetUserStatsRequestDto.fromRequest(userId, req.query);
            const result = await this.getUserStatsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: UserMessages_1.USER_MESSAGES.PROFILE.STATS_FETCHED,
                data: result.getValue(),
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("UserProfileController.getMyStats error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.UserProfileController = UserProfileController;
exports.UserProfileController = UserProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserProfileUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateUserProfileUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RegisterUserAsDriverUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserStatsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserProfileController);
//# sourceMappingURL=UserProfileController.js.map