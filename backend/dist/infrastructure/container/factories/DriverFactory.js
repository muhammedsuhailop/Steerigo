"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
// Repository bindings are handled in AdminDriverFactory
// Driver Use Cases
const RegisterDriverUseCase_1 = require("../../../application/use-cases/driver/RegisterDriverUseCase");
const UpdateDriverProfileUseCase_1 = require("../../../application/use-cases/driver/UpdateDriverProfileUseCase");
const SubmitKYCUseCase_1 = require("../../../application/use-cases/driver/SubmitKYCUseCase");
const GetKYCStatusUseCase_1 = require("../../../application/use-cases/driver/GetKYCStatusUseCase");
// Driver Controllers
const DriverController_1 = require("../../../interface/controllers/driver/DriverController");
const DriverDashboardRepositoryImpl_1 = require("../../database/repositories/driver/DriverDashboardRepositoryImpl");
const GetDriverDashboardUseCase_1 = require("../../../application/use-cases/driver/GetDriverDashboardUseCase");
const GetDriverStatusUseCase_1 = require("../../../application/use-cases/driver/GetDriverStatusUseCase");
const GetDriverDetailedProfileUseCase_1 = require("../../../application/use-cases/driver/GetDriverDetailedProfileUseCase");
const EditAvailabilityExceptionUseCase_1 = require("../../../application/use-cases/driver/EditAvailabilityExceptionUseCase");
const RemoveAvailabilityExceptionUseCase_1 = require("../../../application/use-cases/driver/RemoveAvailabilityExceptionUseCase");
const AcceptRideRequestUseCase_1 = require("../../../application/use-cases/driver/AcceptRideRequestUseCase");
const RejectRideRequestUseCase_1 = require("../../../application/use-cases/driver/RejectRideRequestUseCase");
const GetPendingRideRequestsUseCase_1 = require("../../../application/use-cases/driver/GetPendingRideRequestsUseCase");
const GetDriverRidesUseCase_1 = require("../../../application/use-cases/driver/GetDriverRidesUseCase");
const GetDriverRideByIdUseCase_1 = require("../../../application/use-cases/driver/GetDriverRideByIdUseCase");
const MarkRideAsArrivedUseCase_1 = require("../../../application/use-cases/driver/MarkRideAsArrivedUseCase");
const MarkRideAsStartedUseCase_1 = require("../../../application/use-cases/driver/MarkRideAsStartedUseCase");
const MarkRideAsCompletedUseCase_1 = require("../../../application/use-cases/driver/MarkRideAsCompletedUseCase");
const RequestPayoutUseCase_1 = require("../../../application/use-cases/driver/RequestPayoutUseCase");
const GetDriverPayoutsUseCase_1 = require("../../../application/use-cases/driver/GetDriverPayoutsUseCase");
const GetDriverWalletUseCase_1 = require("../../../application/use-cases/driver/GetDriverWalletUseCase");
const DriverWalletController_1 = require("../../../interface/controllers/driver/DriverWalletController");
const DriverCancelRideUseCase_1 = require("../../../application/use-cases/driver/DriverCancelRideUseCase");
const DriverStatsController_1 = require("../../../interface/controllers/driver/DriverStatsController");
const GetDriverStatsUseCase_1 = require("../../../application/use-cases/driver/GetDriverStatsUseCase");
class DriverFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.DriverDashboardRepository)
            .to(DriverDashboardRepositoryImpl_1.DriverDashboardRepositoryImpl)
            .inSingletonScope();
        // Use case bindings
        container
            .bind(DITypes_1.TYPES.RegisterDriverUseCase)
            .to(RegisterDriverUseCase_1.DriverRegistrationUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateDriverProfileUseCase)
            .to(UpdateDriverProfileUseCase_1.UpdateDriverProfileUseCase);
        container
            .bind(DITypes_1.TYPES.SubmitKYCUseCase)
            .to(SubmitKYCUseCase_1.SubmitKYCUseCase);
        container
            .bind(DITypes_1.TYPES.GetKYCStatusUseCase)
            .to(GetKYCStatusUseCase_1.GetKYCStatusUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverDashboardUseCase)
            .to(GetDriverDashboardUseCase_1.GetDriverDashboardUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverStatusUseCase)
            .to(GetDriverStatusUseCase_1.GetDriverStatusUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverDetailedProfileUseCase)
            .to(GetDriverDetailedProfileUseCase_1.GetDriverDetailedProfileUseCase);
        container
            .bind(DITypes_1.TYPES.EditAvailabilityExceptionUseCase)
            .to(EditAvailabilityExceptionUseCase_1.EditAvailabilityExceptionUseCase);
        container
            .bind(DITypes_1.TYPES.RemoveAvailabilityExceptionUseCase)
            .to(RemoveAvailabilityExceptionUseCase_1.RemoveAvailabilityExceptionUseCase);
        container
            .bind(DITypes_1.TYPES.AcceptRideRequestUseCase)
            .to(AcceptRideRequestUseCase_1.AcceptRideRequestUseCase);
        container
            .bind(DITypes_1.TYPES.RejectRideRequestUseCase)
            .to(RejectRideRequestUseCase_1.RejectRideRequestUseCase);
        container
            .bind(DITypes_1.TYPES.GetPendingRideRequestsUseCase)
            .to(GetPendingRideRequestsUseCase_1.GetPendingRideRequestsUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverRidesUseCase)
            .to(GetDriverRidesUseCase_1.GetDriverRidesUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverRideByIdUseCase)
            .to(GetDriverRideByIdUseCase_1.GetDriverRideByIdUseCase);
        container
            .bind(DITypes_1.TYPES.MarkRideAsArrivedUseCase)
            .to(MarkRideAsArrivedUseCase_1.MarkRideAsArrivedUseCase);
        container
            .bind(DITypes_1.TYPES.MarkRideAsStartedUseCase)
            .to(MarkRideAsStartedUseCase_1.MarkRideAsStartedUseCase);
        container
            .bind(DITypes_1.TYPES.MarkRideAsCompletedUseCase)
            .to(MarkRideAsCompletedUseCase_1.MarkRideAsCompletedUseCase);
        container
            .bind(DITypes_1.TYPES.RequestPayoutUseCase)
            .to(RequestPayoutUseCase_1.RequestPayoutUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverPayoutsUseCase)
            .to(GetDriverPayoutsUseCase_1.GetDriverPayoutsUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverWalletUseCase)
            .to(GetDriverWalletUseCase_1.GetDriverWalletUseCase);
        container
            .bind(DITypes_1.TYPES.DriverCancelRideUseCase)
            .to(DriverCancelRideUseCase_1.DriverCancelRideUseCase);
        container
            .bind(DITypes_1.TYPES.GetDriverStatsUseCase)
            .to(GetDriverStatsUseCase_1.GetDriverStatsUseCase);
        // Controller bindings
        container.bind(DITypes_1.TYPES.DriverController).to(DriverController_1.DriverController);
        container.bind(DITypes_1.TYPES.DriverWalletController).to(DriverWalletController_1.DriverWalletController);
        container.bind(DITypes_1.TYPES.DriverStatsController).to(DriverStatsController_1.DriverStatsController);
    }
}
exports.DriverFactory = DriverFactory;
//# sourceMappingURL=DriverFactory.js.map