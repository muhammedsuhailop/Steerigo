"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureRideRequestFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const FutureRideRequestRepositoryImpl_1 = require("../../database/repositories/FutureRideRequestRepositoryImpl");
const ScheduleFutureRideRequestUseCase_1 = require("../../../application/use-cases/user/ScheduleFutureRideRequestUseCase");
const CancelFutureRideRequestUseCase_1 = require("../../../application/use-cases/user/CancelFutureRideRequestUseCase");
const FutureRideExpiryService_1 = require("../../services/FutureRideExpiryService");
const FutureRideExpiryWorker_1 = require("../../workers/FutureRideExpiryWorker");
const bullmq_1 = require("bullmq");
const AppConstants_1 = require("../../../shared/constants/AppConstants");
const BullMQConnection_1 = require("../../queues/BullMQConnection");
const AcceptFutureRideRequestUseCase_1 = require("../../../application/use-cases/driver/AcceptFutureRideRequestUseCase");
const DriverScheduleRideController_1 = require("../../../interface/controllers/driver/DriverScheduleRideController");
const GetFutureRideRequestsUseCase_1 = require("../../../application/use-cases/driver/GetFutureRideRequestsUseCase");
const RejectFutureRideRequestUseCase_1 = require("../../../application/use-cases/driver/RejectFutureRideRequestUseCase");
class FutureRideRequestFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.FutureRideRequestRepository)
            .to(FutureRideRequestRepositoryImpl_1.FutureRideRequestRepositoryImpl);
        const futureRideExpiryQueue = new bullmq_1.Queue(AppConstants_1.AppConstants.FUTURE_RIDE_EXPIRY_QUEUE_NAME, { connection: (0, BullMQConnection_1.getBullMQConnection)() });
        container
            .bind(DITypes_1.TYPES.FutureRideExpiryQueue)
            .toConstantValue(futureRideExpiryQueue);
        // Use Cases
        container
            .bind(DITypes_1.TYPES.ScheduleFutureRideRequestUseCase)
            .to(ScheduleFutureRideRequestUseCase_1.ScheduleFutureRideRequestUseCase);
        container
            .bind(DITypes_1.TYPES.CancelFutureRideRequestUseCase)
            .to(CancelFutureRideRequestUseCase_1.CancelFutureRideRequestUseCase);
        container
            .bind(DITypes_1.TYPES.GetFutureRideRequestsUseCase)
            .to(GetFutureRideRequestsUseCase_1.GetFutureRideRequestsUseCase);
        container
            .bind(DITypes_1.TYPES.AcceptFutureRideRequestUseCase)
            .to(AcceptFutureRideRequestUseCase_1.AcceptFutureRideRequestUseCase);
        container
            .bind(DITypes_1.TYPES.RejectFutureRideRequestUseCase)
            .to(RejectFutureRideRequestUseCase_1.RejectFutureRideRequestUseCase);
        container
            .bind(DITypes_1.TYPES.FutureRideExpiryService)
            .to(FutureRideExpiryService_1.FutureRideExpiryService)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.FutureRideExpiryWorker)
            .to(FutureRideExpiryWorker_1.FutureRideExpiryWorker)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.DriverScheduleRideController)
            .to(DriverScheduleRideController_1.DriverScheduleRideController)
            .inSingletonScope();
    }
}
exports.FutureRideRequestFactory = FutureRideRequestFactory;
//# sourceMappingURL=FutureRideRequestFactory.js.map