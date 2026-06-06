"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
// Import all use cases
const LoginUseCase_1 = require("../../../application/use-cases/auth/LoginUseCase");
const LogoutUseCase_1 = require("../../../application/use-cases/auth/LogoutUseCase");
const RefreshTokenUseCase_1 = require("../../../application/use-cases/auth/RefreshTokenUseCase");
const SignupRequestUseCase_1 = require("../../../application/use-cases/auth/SignupRequestUseCase");
const SignupVerifyUseCase_1 = require("../../../application/use-cases/auth/SignupVerifyUseCase");
const ForgotPasswordRequestUseCase_1 = require("../../../application/use-cases/auth/ForgotPasswordRequestUseCase");
const ForgotPasswordVerifyUseCase_1 = require("../../../application/use-cases/auth/ForgotPasswordVerifyUseCase");
const UpdatePasswordUseCase_1 = require("../../../application/use-cases/auth/UpdatePasswordUseCase");
const ResendOtpUseCase_1 = require("../../../application/use-cases/auth/ResendOtpUseCase");
const GetCurrentUserUseCase_1 = require("../../../application/use-cases/auth/GetCurrentUserUseCase");
const GoogleLoginUseCase_1 = require("../../../application/use-cases/auth/GoogleLoginUseCase");
const GetGoogleAuthUrlUseCase_1 = require("../../../application/use-cases/auth/GetGoogleAuthUrlUseCase");
const AutoSearchAndSendRideRequestUseCase_1 = require("../../../application/use-cases/user/AutoSearchAndSendRideRequestUseCase");
class UseCaseFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.LoginUseCase)
            .to(LoginUseCase_1.LoginUseCase);
        container
            .bind(DITypes_1.TYPES.LogoutUseCase)
            .to(LogoutUseCase_1.LogoutUseCase);
        container
            .bind(DITypes_1.TYPES.RefreshTokenUseCase)
            .to(RefreshTokenUseCase_1.RefreshTokenUseCase);
        container
            .bind(DITypes_1.TYPES.SignupRequestUseCase)
            .to(SignupRequestUseCase_1.SignupRequestUseCase);
        container
            .bind(DITypes_1.TYPES.SignupVerifyUseCase)
            .to(SignupVerifyUseCase_1.SignupVerifyUseCase);
        container
            .bind(DITypes_1.TYPES.ForgotPasswordRequestUseCase)
            .to(ForgotPasswordRequestUseCase_1.ForgotPasswordRequestUseCase);
        container
            .bind(DITypes_1.TYPES.ForgotPasswordVerifyUseCase)
            .to(ForgotPasswordVerifyUseCase_1.ForgotPasswordVerifyUseCase);
        container
            .bind(DITypes_1.TYPES.UpdatePasswordUseCase)
            .to(UpdatePasswordUseCase_1.UpdatePasswordUseCase);
        container
            .bind(DITypes_1.TYPES.ResendOtpUseCase)
            .to(ResendOtpUseCase_1.ResendOtpUseCase);
        container
            .bind(DITypes_1.TYPES.GetCurrentUserUseCase)
            .to(GetCurrentUserUseCase_1.GetCurrentUserUseCase);
        container
            .bind(DITypes_1.TYPES.GoogleLoginUseCase)
            .to(GoogleLoginUseCase_1.GoogleLoginUseCase);
        container
            .bind(DITypes_1.TYPES.GetGoogleAuthUrlUseCase)
            .to(GetGoogleAuthUrlUseCase_1.GetGoogleAuthUrlUseCase);
        container
            .bind(DITypes_1.TYPES.AutoSearchAndSendRideRequestUseCase)
            .to(AutoSearchAndSendRideRequestUseCase_1.AutoSearchAndSendRideRequestUseCase);
    }
}
exports.UseCaseFactory = UseCaseFactory;
//# sourceMappingURL=UseCaseFactory.js.map