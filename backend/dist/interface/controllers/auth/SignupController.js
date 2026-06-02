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
exports.SignupController = void 0;
const inversify_1 = require("inversify");
const SignupRequestDto_1 = require("@application/dto/auth/SignupRequestDto");
const SignupVerifyDto_1 = require("@application/dto/auth/SignupVerifyDto");
const Logger_1 = require("@shared/utils/Logger");
const ErrorHandlerService_1 = require("@shared/utils/ErrorHandlerService");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const DITypes_1 = require("@shared/constants/DITypes");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const CookieHelper_1 = require("@shared/utils/CookieHelper");
let SignupController = class SignupController {
    constructor(signupRequestUseCase, signupVerifyUseCase) {
        this.signupRequestUseCase = signupRequestUseCase;
        this.signupVerifyUseCase = signupVerifyUseCase;
    }
    async signup(req, res) {
        try {
            const dto = SignupRequestDto_1.SignupRequestDto.fromRequest(req.body);
            const result = await this.signupRequestUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "signup");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.SIGNUP_SUCCESS,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json(response);
            Logger_1.Logger.info("Signup request completed successfully", {
                email: dto.getEmailValue(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "signup");
            res.status(statusCode).json(response);
        }
    }
    async verify(req, res) {
        try {
            const dto = SignupVerifyDto_1.SignupVerifyDto.fromRequest(req.body);
            const result = await this.signupVerifyUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "signup_verify");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            CookieHelper_1.CookieHelper.setRefreshTokenCookie(res, data.refreshToken);
            const { refreshToken: _refreshToken, ...dataWithoutRefreshToken } = data;
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.SIGNUP_VERIFICATION_SUCCESS,
                data: dataWithoutRefreshToken,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Signup verification completed successfully", {
                email: dto.getEmail(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "signup_verify");
            res.status(statusCode).json(response);
        }
    }
};
exports.SignupController = SignupController;
exports.SignupController = SignupController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.SignupRequestUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.SignupVerifyUseCase)),
    __metadata("design:paramtypes", [Object, Object])
], SignupController);
//# sourceMappingURL=SignupController.js.map