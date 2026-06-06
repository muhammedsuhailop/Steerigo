"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
// User Use Cases
const GetUserProfileUseCase_1 = require("../../../application/use-cases/user/GetUserProfileUseCase");
const UpdateUserProfileUseCase_1 = require("../../../application/use-cases/user/UpdateUserProfileUseCase");
const RegisterUserAsDriverUseCase_1 = require("../../../application/use-cases/user/RegisterUserAsDriverUseCase");
// User Controllers
const UserProfileController_1 = require("../../../interface/controllers/user/UserProfileController");
const FindNearbyDriversUseCase_1 = require("../../../application/use-cases/user/FindNearbyDriversUseCase");
const CancelRideRequestsUseCase_1 = require("../../../application/use-cases/user/CancelRideRequestsUseCase");
const GetUserRideByIdUseCase_1 = require("../../../application/use-cases/user/GetUserRideByIdUseCase");
const GetUserRidesUseCase_1 = require("../../../application/use-cases/user/GetUserRidesUseCase");
const CancelRideUseCase_1 = require("../../../application/use-cases/user/CancelRideUseCase");
const RateDriverUseCase_1 = require("../../../application/use-cases/user/RateDriverUseCase");
const ApplyCouponUseCase_1 = require("../../../application/use-cases/user/ApplyCouponUseCase");
const RemoveCouponUseCase_1 = require("../../../application/use-cases/user/RemoveCouponUseCase");
const GetUserCouponsUseCase_1 = require("../../../application/use-cases/user/GetUserCouponsUseCase");
const GetUserStatsUseCase_1 = require("../../../application/use-cases/user/GetUserStatsUseCase");
class UserFactory {
    static register(container) {
        // Use case bindings
        container
            .bind(DITypes_1.TYPES.GetUserProfileUseCase)
            .to(GetUserProfileUseCase_1.GetUserProfileUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateUserProfileUseCase)
            .to(UpdateUserProfileUseCase_1.UpdateUserProfileUseCase);
        container
            .bind(DITypes_1.TYPES.RegisterUserAsDriverUseCase)
            .to(RegisterUserAsDriverUseCase_1.RegisterUserAsDriverUseCase);
        container
            .bind(DITypes_1.TYPES.FindNearbyDriversUseCase)
            .to(FindNearbyDriversUseCase_1.FindNearbyDriversUseCase);
        container
            .bind(DITypes_1.TYPES.CancelRideRequestsUseCase)
            .to(CancelRideRequestsUseCase_1.CancelRideRequestsUseCase);
        container
            .bind(DITypes_1.TYPES.GetUserRideByIdUseCase)
            .to(GetUserRideByIdUseCase_1.GetUserRideByIdUseCase);
        container
            .bind(DITypes_1.TYPES.GetUserRidesUseCase)
            .to(GetUserRidesUseCase_1.GetUserRidesUseCase);
        container
            .bind(DITypes_1.TYPES.CancelRideUseCase)
            .to(CancelRideUseCase_1.CancelRideUseCase);
        container
            .bind(DITypes_1.TYPES.RateDriverUseCase)
            .to(RateDriverUseCase_1.RateDriverUseCase);
        container
            .bind(DITypes_1.TYPES.ApplyCouponUseCase)
            .to(ApplyCouponUseCase_1.ApplyCouponUseCase);
        container
            .bind(DITypes_1.TYPES.RemoveCouponUseCase)
            .to(RemoveCouponUseCase_1.RemoveCouponUseCase);
        container
            .bind(DITypes_1.TYPES.GetUserCouponsUseCase)
            .to(GetUserCouponsUseCase_1.GetUserCouponsUseCase);
        container
            .bind(DITypes_1.TYPES.GetUserStatsUseCase)
            .to(GetUserStatsUseCase_1.GetUserStatsUseCase);
        // Controller bindings
        container.bind(DITypes_1.TYPES.UserProfileController).to(UserProfileController_1.UserProfileController);
    }
}
exports.UserFactory = UserFactory;
//# sourceMappingURL=UserFactory.js.map