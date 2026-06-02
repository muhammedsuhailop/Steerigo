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
exports.PasswordController = void 0;
const inversify_1 = require("inversify");
const ForgotPasswordRequestDto_1 = require("../../../application/dto/auth/ForgotPasswordRequestDto");
const ForgotPasswordVerifyDto_1 = require("../../../application/dto/auth/ForgotPasswordVerifyDto");
const UpdatePasswordDto_1 = require("../../../application/dto/auth/UpdatePasswordDto");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
let PasswordController = class PasswordController {
    constructor(forgotPasswordRequestUseCase, forgotPasswordVerifyUseCase, updatePasswordUseCase) {
        this.forgotPasswordRequestUseCase = forgotPasswordRequestUseCase;
        this.forgotPasswordVerifyUseCase = forgotPasswordVerifyUseCase;
        this.updatePasswordUseCase = updatePasswordUseCase;
    }
    async forgotPasswordRequest(req, res) {
        try {
            const dto = ForgotPasswordRequestDto_1.ForgotPasswordRequestDto.fromRequest(req.body);
            const result = await this.forgotPasswordRequestUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "forgot_password_request");
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.PASSWORD_RESET_REQUEST_SUCCESS,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Forgot password request completed successfully", {
                email: dto.getEmail(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Forgot password request controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: AuthConstants_1.AuthMessages.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async forgotPasswordVerify(req, res) {
        try {
            const dto = ForgotPasswordVerifyDto_1.ForgotPasswordVerifyDto.fromRequest(req.body);
            const result = await this.forgotPasswordVerifyUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "forgot_password_verify");
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.PASSWORD_RESET_SUCCESS,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Forgot password verify completed successfully", {
                email: dto.getEmail(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Forgot password verify controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: AuthConstants_1.AuthMessages.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async updatePassword(req, res) {
        try {
            const userId = req.user?.userId; // From auth middleware
            const dto = UpdatePasswordDto_1.UpdatePasswordDto.fromRequest(userId, req.body);
            const result = await this.updatePasswordUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "update_password");
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.PASSWORD_UPDATE_SUCCESS,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Update password completed successfully", {
                userId: dto.getUserId(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Update password controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: AuthConstants_1.AuthMessages.INTERNAL_SERVER_ERROR,
            });
        }
    }
};
exports.PasswordController = PasswordController;
exports.PasswordController = PasswordController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ForgotPasswordRequestUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.ForgotPasswordVerifyUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UpdatePasswordUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], PasswordController);
//# sourceMappingURL=PasswordController.js.map