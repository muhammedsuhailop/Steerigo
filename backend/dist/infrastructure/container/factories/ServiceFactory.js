"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFactory = void 0;
const DITypes_1 = require("@shared/constants/DITypes");
// Infrastructure Service Implementations
const PasswordService_1 = require("@infrastructure/services/PasswordService");
const TokenService_1 = require("@infrastructure/services/TokenService");
const EmailService_1 = require("@infrastructure/services/EmailService");
const OtpService_1 = require("@infrastructure/services/OtpService");
const GoogleAuthService_1 = require("@infrastructure/services/GoogleAuthService");
const TokenManagementService_1 = require("@infrastructure/services/TokenManagementService");
const CryptoAdapter_1 = require("@infrastructure/adapters/CryptoAdapter");
const CloudinaryService_1 = require("@infrastructure/services/CloudinaryService");
const AvailabilityCheckService_1 = require("@infrastructure/services/AvailabilityCheckService");
const DistributedLockService_1 = require("@infrastructure/services/DistributedLockService");
const RideNotificationService_1 = require("@infrastructure/services/RideNotificationService");
const InMemoryEventBus_1 = require("@infrastructure/services/InMemoryEventBus");
const RedisService_1 = require("@infrastructure/services/RedisService");
const MongoIdGenerator_1 = require("@infrastructure/services/MongoIdGenerator");
const CancellationChargeService_1 = require("@infrastructure/services/CancellationChargeService");
const CouponValidationService_1 = require("@infrastructure/services/CouponValidationService");
const CouponUsageService_1 = require("@infrastructure/services/CouponUsageService");
const RideSearchQueueProducer_1 = require("@infrastructure/queues/RideSearchQueueProducer");
const RideSearchDispatchService_1 = require("@application/services/ride-search/RideSearchDispatchService");
const RideRequestTimeoutWorker_1 = require("@infrastructure/workers/RideRequestTimeoutWorker");
const BullMqRideSearchQueue_1 = require("@infrastructure/queues/BullMqRideSearchQueue");
const WorkerSocketBridge_1 = require("@infrastructure/realtime/WorkerSocketBridge");
const UuidGenerator_1 = require("@infrastructure/services/UuidGenerator");
const NanoIdGenerator_1 = require("@infrastructure/services/NanoIdGenerator");
class ServiceFactory {
    static register(container) {
        // Bind Service Interfaces to Implementations
        container.bind(DITypes_1.TYPES.PasswordService).to(PasswordService_1.PasswordService);
        container.bind(DITypes_1.TYPES.TokenService).to(TokenService_1.TokenService);
        container.bind(DITypes_1.TYPES.EmailService).to(EmailService_1.EmailService);
        container.bind(DITypes_1.TYPES.OtpService).to(OtpService_1.OtpService);
        container
            .bind(DITypes_1.TYPES.GoogleAuthService)
            .to(GoogleAuthService_1.GoogleAuthService);
        container
            .bind(DITypes_1.TYPES.TokenManagementService)
            .to(TokenManagementService_1.TokenManagementService);
        container
            .bind(DITypes_1.TYPES.CryptoAdapter)
            .to(CryptoAdapter_1.BcryptAdapter)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.FileUploadService)
            .to(CloudinaryService_1.CloudinaryService)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.AvailabilityCheckService)
            .to(AvailabilityCheckService_1.AvailabilityCheckService);
        container
            .bind(DITypes_1.TYPES.DistributedLockService)
            .to(DistributedLockService_1.RedisLockService);
        container
            .bind(DITypes_1.TYPES.RideNotificationService)
            .to(RideNotificationService_1.RideNotificationService)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.CancellationChargeService)
            .to(CancellationChargeService_1.CancellationChargeService);
        container
            .bind(DITypes_1.TYPES.EventBus)
            .to(InMemoryEventBus_1.InMemoryEventBus)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.RedisService)
            .to(RedisService_1.RedisService)
            .inSingletonScope();
        container.bind(DITypes_1.TYPES.IDGenerator).to(MongoIdGenerator_1.MongoIdGenerator);
        container.bind(DITypes_1.TYPES.UuidGenerator).to(UuidGenerator_1.UuidGenerator);
        container.bind(DITypes_1.TYPES.NanoIdGenerator).to(NanoIdGenerator_1.NanoIdGenerator);
        container
            .bind(DITypes_1.TYPES.CouponValidationService)
            .to(CouponValidationService_1.CouponValidationService);
        container
            .bind(DITypes_1.TYPES.CouponUsageService)
            .to(CouponUsageService_1.CouponUsageService);
        container
            .bind(DITypes_1.TYPES.RideSearchQueueProducer)
            .to(RideSearchQueueProducer_1.RideSearchQueueProducer);
        container
            .bind(DITypes_1.TYPES.RideSearchDispatchService)
            .to(RideSearchDispatchService_1.RideSearchDispatchService);
        container
            .bind(DITypes_1.TYPES.RideRequestTimeoutWorker)
            .to(RideRequestTimeoutWorker_1.RideRequestTimeoutWorker);
        container
            .bind(DITypes_1.TYPES.RideSearchQueue)
            .to(BullMqRideSearchQueue_1.BullMqRideSearchQueue);
        container
            .bind(DITypes_1.TYPES.WorkerSocketBridge)
            .to(WorkerSocketBridge_1.WorkerSocketBridge);
    }
}
exports.ServiceFactory = ServiceFactory;
//# sourceMappingURL=ServiceFactory.js.map