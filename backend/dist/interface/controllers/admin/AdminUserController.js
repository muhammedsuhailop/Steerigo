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
exports.AdminUserController = void 0;
const inversify_1 = require("inversify");
const GetUsersRequestDto_1 = require("@application/dto/admin/GetUsersRequestDto");
const UpdateUserStatusRequestDto_1 = require("@application/dto/admin/UpdateUserStatusRequestDto");
const ErrorHandlerService_1 = require("@shared/utils/ErrorHandlerService");
const DITypes_1 = require("@shared/constants/DITypes");
const AdminMessages_1 = require("@shared/constants/AdminMessages");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const GetUserProfileRequestDto_1 = require("@application/dto/admin/GetUserProfileRequestDto");
let AdminUserController = class AdminUserController {
    constructor(getUsersUseCase, updateUserStatusUseCase, getUserProfileUseCase) {
        this.getUsersUseCase = getUsersUseCase;
        this.updateUserStatusUseCase = updateUserStatusUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
    }
    async getUsers(req, res) {
        try {
            const dto = GetUsersRequestDto_1.GetUsersRequestDto.fromRequest(req.query);
            const result = await this.getUsersUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_users");
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.USER.USERS_FETCHED,
                data: result.getValue(),
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_users");
            res.status(statusCode).json(response);
        }
    }
    async updateUserStatus(req, res) {
        try {
            const dto = UpdateUserStatusRequestDto_1.UpdateUserStatusRequestDto.fromRequest(req.params.userId, req.body);
            const result = await this.updateUserStatusUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "update_user_status");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: data.message || AdminMessages_1.ADMIN_MESSAGES.USER.USER_STATUS_UPDATED,
                data: {
                    userId: data.userId,
                    newStatus: data.newStatus,
                },
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "update_user_status");
            res.status(statusCode).json(response);
        }
    }
    async getUserProfile(req, res) {
        try {
            const userId = req.params.userId;
            const dto = new GetUserProfileRequestDto_1.GetUserProfileRequestDto(userId);
            const result = await this.getUserProfileUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_user_profile");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.USER.USER_PROFILE_FETCHED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_user_profile");
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminUserController = AdminUserController;
exports.AdminUserController = AdminUserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetUsersUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateUserStatusUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserProfileDetailsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminUserController);
//# sourceMappingURL=AdminUserController.js.map