"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDriverFactory = void 0;
const DITypes_1 = require("@shared/constants/DITypes");
const DriverRepositoryImpl_1 = require("@infrastructure/database/repositories/DriverRepositoryImpl");
const KYCRepositoryImpl_1 = require("@infrastructure/database/repositories/KYCRepositoryImpl");
// Admin Driver Use Cases
const GetDriversUseCase_1 = require("@application/use-cases/admin/GetDriversUseCase");
const DriverActionUseCase_1 = require("@application/use-cases/admin/DriverActionUseCase");
const GetDriverProfileUseCase_1 = require("@application/use-cases/admin/GetDriverProfileUseCase");
const GetKycRequestsUseCase_1 = require("@application/use-cases/admin/GetKycRequestsUseCase");
const UpdateKycStatusUseCase_1 = require("@application/use-cases/admin/UpdateKycStatusUseCase");
const GetKycRequestByIdUseCase_1 = require("@application/use-cases/admin/GetKycRequestByIdUseCase");
// Admin Driver Controllers
const AdminDriverController_1 = require("@interface/controllers/admin/AdminDriverController");
const UpdateDriverKycStatusUseCase_1 = require("@application/use-cases/admin/UpdateDriverKycStatusUseCase");
class AdminDriverFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.DriverRepository)
            .to(DriverRepositoryImpl_1.DriverRepositoryImpl)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.AdminDriverRepository)
            .toService(DITypes_1.TYPES.DriverRepository);
        container
            .bind(DITypes_1.TYPES.KYCRepository)
            .to(KYCRepositoryImpl_1.KYCRepositoryImpl)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.AdminKYCRepository)
            .toService(DITypes_1.TYPES.KYCRepository);
        // Use case bindings
        container
            .bind(DITypes_1.TYPES.GetDriversUseCase)
            .to(GetDriversUseCase_1.GetDriversUseCase);
        container
            .bind(DITypes_1.TYPES.DriverActionUseCase)
            .to(DriverActionUseCase_1.DriverActionUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverProfileUseCase)
            .to(GetDriverProfileUseCase_1.GetDriverProfileUseCase);
        container
            .bind(DITypes_1.TYPES.GetKycRequestsUseCase)
            .to(GetKycRequestsUseCase_1.GetKycRequestsUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateKycStatusUseCase)
            .to(UpdateKycStatusUseCase_1.UpdateKycStatusUseCase);
        container
            .bind(DITypes_1.TYPES.GetKycRequestByIdUseCase)
            .to(GetKycRequestByIdUseCase_1.GetKycRequestByIdUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateDriverKycStatusUseCase)
            .to(UpdateDriverKycStatusUseCase_1.UpdateDriverKycStatusUseCase);
        // Controller bindings
        container.bind(DITypes_1.TYPES.AdminDriverController).to(AdminDriverController_1.AdminDriverController);
    }
}
exports.AdminDriverFactory = AdminDriverFactory;
//# sourceMappingURL=AdminDriverFactory.js.map