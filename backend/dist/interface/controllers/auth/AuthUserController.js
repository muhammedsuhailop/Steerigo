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
exports.AuthUserController = void 0;
const inversify_1 = require("inversify");
const GetCurrentUserDto_1 = require("../../../application/dto/auth/GetCurrentUserDto");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
let AuthUserController = class AuthUserController {
    constructor(getCurrentUserUseCase) {
        this.getCurrentUserUseCase = getCurrentUserUseCase;
    }
    async getCurrentUser(req, res) {
        try {
            const userId = req.user?.userId;
            // Handle missing auth user
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: AuthConstants_1.AuthMessages.UNAUTHORIZED,
                });
                return;
            }
            const dto = GetCurrentUserDto_1.GetCurrentUserDto.fromRequest({ userId });
            const result = await this.getCurrentUserUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_current_user");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.USER_PROFILE_SUCCESS,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Get current user completed successfully", {
                userId: dto.getUserId(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Get current user controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: AuthConstants_1.AuthMessages.INTERNAL_SERVER_ERROR,
            });
        }
    }
};
exports.AuthUserController = AuthUserController;
exports.AuthUserController = AuthUserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetCurrentUserUseCase)),
    __metadata("design:paramtypes", [Object])
], AuthUserController);
//# sourceMappingURL=AuthUserController.js.map