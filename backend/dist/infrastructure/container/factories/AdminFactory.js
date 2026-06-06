"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const AdminUserRepositoryImpl_1 = require("../../database/repositories/AdminUserRepositoryImpl");
// Admin Use Cases
const GetUsersUseCase_1 = require("../../../application/use-cases/admin/GetUsersUseCase");
const UpdateUserStatusUseCase_1 = require("../../../application/use-cases/admin/UpdateUserStatusUseCase");
// Admin Controllers
const AdminUserController_1 = require("../../../interface/controllers/admin/AdminUserController");
const GetUserProfileDetailsUseCase_1 = require("../../../application/use-cases/admin/GetUserProfileDetailsUseCase");
const GetAdminRidesUseCase_1 = require("../../../application/use-cases/admin/GetAdminRidesUseCase");
const AdminRideController_1 = require("../../../interface/controllers/admin/AdminRideController");
const ApprovePayoutUseCase_1 = require("../../../application/use-cases/admin/ApprovePayoutUseCase");
const RejectPayoutUseCase_1 = require("../../../application/use-cases/admin/RejectPayoutUseCase");
const GetAdminPayoutsUseCase_1 = require("../../../application/use-cases/admin/GetAdminPayoutsUseCase");
const CreateCouponUseCase_1 = require("../../../application/use-cases/admin/CreateCouponUseCase");
const EditCouponUseCase_1 = require("../../../application/use-cases/admin/EditCouponUseCase");
const AdminCouponController_1 = require("../../../interface/controllers/admin/AdminCouponController");
const GetAdminCouponsUseCase_1 = require("../../../application/use-cases/admin/GetAdminCouponsUseCase");
const GetAdminRatingsUseCase_1 = require("../../../application/use-cases/admin/GetAdminRatingsUseCase");
const GetAdminTransactionsUseCase_1 = require("../../../application/use-cases/admin/GetAdminTransactionsUseCase");
const AdminTransactionController_1 = require("../../../interface/controllers/admin/AdminTransactionController");
const GetAdminRideByIdUseCase_1 = require("../../../application/use-cases/admin/GetAdminRideByIdUseCase");
const GetAdminWalletUseCase_1 = require("../../../application/use-cases/admin/GetAdminWalletUseCase");
const AdminWalletController_1 = require("../../../interface/controllers/admin/AdminWalletController");
const GetAdminUserStatsUseCase_1 = require("../../../application/use-cases/admin/GetAdminUserStatsUseCase");
const AdminStatsController_1 = require("../../../interface/controllers/admin/AdminStatsController");
const GetAdminRideStatsUseCase_1 = require("../../../application/use-cases/admin/GetAdminRideStatsUseCase");
const GetAdminDriverStatsUseCase_1 = require("../../../application/use-cases/admin/GetAdminDriverStatsUseCase");
class AdminFactory {
    static register(container) {
        // Repository bindings
        container
            .bind(DITypes_1.TYPES.AdminUserRepository)
            .to(AdminUserRepositoryImpl_1.AdminUserRepositoryImpl);
        // Use case bindings
        container
            .bind(DITypes_1.TYPES.GetUsersUseCase)
            .to(GetUsersUseCase_1.GetUsersUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateUserStatusUseCase)
            .to(UpdateUserStatusUseCase_1.UpdateUserStatusUseCase);
        container
            .bind(DITypes_1.TYPES.GetUserProfileDetailsUseCase)
            .to(GetUserProfileDetailsUseCase_1.GetUserProfileDetailsUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminRidesUseCase)
            .to(GetAdminRidesUseCase_1.GetAdminRidesUseCase);
        container.bind(DITypes_1.TYPES.ApprovePayoutUseCase).to(ApprovePayoutUseCase_1.ApprovePayoutUseCase);
        container.bind(DITypes_1.TYPES.RejectPayoutUseCase).to(RejectPayoutUseCase_1.RejectPayoutUseCase);
        container.bind(DITypes_1.TYPES.GetAdminPayoutsUseCase).to(GetAdminPayoutsUseCase_1.GetAdminPayoutsUseCase);
        container
            .bind(DITypes_1.TYPES.CreateCouponUseCase)
            .to(CreateCouponUseCase_1.CreateCouponUseCase);
        container
            .bind(DITypes_1.TYPES.EditCouponUseCase)
            .to(EditCouponUseCase_1.EditCouponUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminCouponsUseCase)
            .to(GetAdminCouponsUseCase_1.GetAdminCouponsUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminRatingsUseCase)
            .to(GetAdminRatingsUseCase_1.GetAdminRatingsUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminTransactionsUseCase)
            .to(GetAdminTransactionsUseCase_1.GetAdminTransactionsUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminRideByIdUseCase)
            .to(GetAdminRideByIdUseCase_1.GetAdminRideByIdUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminWalletUseCase)
            .to(GetAdminWalletUseCase_1.GetAdminWalletUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminUserStatsUseCase)
            .to(GetAdminUserStatsUseCase_1.GetAdminUserStatsUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminRideStatsUseCase)
            .to(GetAdminRideStatsUseCase_1.GetAdminRideStatsUseCase);
        container
            .bind(DITypes_1.TYPES.GetAdminDriverStatsUseCase)
            .to(GetAdminDriverStatsUseCase_1.GetAdminDriverStatsUseCase);
        // Controller bindings
        container
            .bind(DITypes_1.TYPES.AdminUserController)
            .to(AdminUserController_1.AdminUserController);
        container
            .bind(DITypes_1.TYPES.AdminRideController)
            .to(AdminRideController_1.AdminRideController);
        container
            .bind(DITypes_1.TYPES.AdminCouponController)
            .to(AdminCouponController_1.AdminCouponController);
        container
            .bind(DITypes_1.TYPES.AdminTransactionController)
            .to(AdminTransactionController_1.AdminTransactionController);
        container
            .bind(DITypes_1.TYPES.AdminWalletController)
            .to(AdminWalletController_1.AdminWalletController);
        container.bind(DITypes_1.TYPES.AdminStatsController).to(AdminStatsController_1.AdminStatsController);
    }
}
exports.AdminFactory = AdminFactory;
//# sourceMappingURL=AdminFactory.js.map