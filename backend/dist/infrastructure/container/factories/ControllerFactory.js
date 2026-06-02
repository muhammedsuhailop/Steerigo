"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerFactory = void 0;
const DITypes_1 = require("@shared/constants/DITypes");
const LoginController_1 = require("@interface/controllers/auth/LoginController");
const UserAuthController_1 = require("@interface/controllers/auth/UserAuthController");
const TokenController_1 = require("@interface/controllers/auth/TokenController");
const SignupController_1 = require("@interface/controllers/auth/SignupController");
const PasswordController_1 = require("@interface/controllers/auth/PasswordController");
const OtpController_1 = require("@interface/controllers/auth/OtpController");
const SocialAuthController_1 = require("@interface/controllers/auth/SocialAuthController");
const DriverSearchController_1 = require("@interface/controllers/user/DriverSearchController");
const AutoRideController_1 = require("@interface/controllers/user/AutoRideController");
const DriverRideController_1 = require("@interface/controllers/driver/DriverRideController");
const DriverRideActionsController_1 = require("@interface/controllers/driver/DriverRideActionsController");
const DriverPayoutController_1 = require("@interface/controllers/driver/DriverPayoutController");
const AdminPayoutController_1 = require("@interface/controllers/admin/AdminPayoutController");
const CouponController_1 = require("@interface/controllers/user/CouponController");
class ControllerFactory {
    static register(container) {
        container.bind(DITypes_1.TYPES.LoginController).to(LoginController_1.LoginController);
        container.bind(DITypes_1.TYPES.UserAuthController).to(UserAuthController_1.UserAuthController);
        container.bind(DITypes_1.TYPES.TokenController).to(TokenController_1.TokenController);
        container.bind(DITypes_1.TYPES.SignupController).to(SignupController_1.SignupController);
        container.bind(DITypes_1.TYPES.PasswordController).to(PasswordController_1.PasswordController);
        container.bind(DITypes_1.TYPES.OtpController).to(OtpController_1.OtpController);
        container.bind(DITypes_1.TYPES.SocialAuthController).to(SocialAuthController_1.SocialAuthController);
        container.bind(DITypes_1.TYPES.DriverSearchController).to(DriverSearchController_1.DriverSearchController);
        container.bind(DITypes_1.TYPES.AutoRideController).to(AutoRideController_1.AutoRideController);
        container.bind(DITypes_1.TYPES.DriverRideController).to(DriverRideController_1.DriverRideController);
        container
            .bind(DITypes_1.TYPES.DriverRideActionsController)
            .to(DriverRideActionsController_1.DriverRideActionsController);
        container.bind(DITypes_1.TYPES.DriverPayoutController).to(DriverPayoutController_1.DriverPayoutController);
        container.bind(DITypes_1.TYPES.AdminPayoutController).to(AdminPayoutController_1.AdminPayoutController);
        container.bind(DITypes_1.TYPES.CouponController).to(CouponController_1.CouponController);
    }
}
exports.ControllerFactory = ControllerFactory;
//# sourceMappingURL=ControllerFactory.js.map