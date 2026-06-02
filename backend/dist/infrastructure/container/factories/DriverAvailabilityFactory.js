"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailabilityFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverAvailabilityRepositoryImpl_1 = require("../../database/repositories/DriverAvailabilityRepositoryImpl");
const UpdateAvailabilityStatusUseCase_1 = require("../../../application/use-cases/driver/UpdateAvailabilityStatusUseCase");
const UpdateDriverLocationUseCase_1 = require("../../../application/use-cases/driver/UpdateDriverLocationUseCase");
const DriverAvailabilityController_1 = require("../../../interface/controllers/driver/DriverAvailabilityController");
const ScheduleRecurringAvailabilityUseCase_1 = require("../../../application/use-cases/driver/ScheduleRecurringAvailabilityUseCase");
const AddAvailabilityExceptionUseCase_1 = require("../../../application/use-cases/driver/AddAvailabilityExceptionUseCase");
const UpdateDriverBaseLocationUseCase_1 = require("../../../application/use-cases/driver/UpdateDriverBaseLocationUseCase");
class DriverAvailabilityFactory {
    static register(container) {
        // Repository
        container
            .bind(DITypes_1.TYPES.DriverAvailabilityRepository)
            .to(DriverAvailabilityRepositoryImpl_1.DriverAvailabilityRepositoryImpl);
        // Use Cases
        container
            .bind(DITypes_1.TYPES.ScheduleRecurringAvailabilityUseCase)
            .to(ScheduleRecurringAvailabilityUseCase_1.ScheduleRecurringAvailabilityUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateAvailabilityStatusUseCase)
            .to(UpdateAvailabilityStatusUseCase_1.UpdateAvailabilityStatusUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateDriverLocationUseCase)
            .to(UpdateDriverLocationUseCase_1.UpdateDriverLocationUseCase);
        container
            .bind(DITypes_1.TYPES.AddAvailabilityExceptionUseCase)
            .to(AddAvailabilityExceptionUseCase_1.AddAvailabilityExceptionUseCase);
        container
            .bind(DITypes_1.TYPES.UpdateDriverBaseLocationUseCase)
            .to(UpdateDriverBaseLocationUseCase_1.UpdateDriverBaseLocationUseCase);
        // Controller
        container
            .bind(DITypes_1.TYPES.DriverAvailabilityController)
            .to(DriverAvailabilityController_1.DriverAvailabilityController);
    }
}
exports.DriverAvailabilityFactory = DriverAvailabilityFactory;
//# sourceMappingURL=DriverAvailabilityFactory.js.map