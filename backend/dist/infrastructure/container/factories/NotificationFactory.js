"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationFactory = void 0;
const NotificationPersistenceService_1 = require("../../../application/services/NotificationPersistenceService");
const CreateNotificationUseCase_1 = require("../../../application/use-cases/notification/CreateNotificationUseCase");
const GetNotificationsUseCase_1 = require("../../../application/use-cases/notification/GetNotificationsUseCase");
const MarkNotificationsReadUseCase_1 = require("../../../application/use-cases/notification/MarkNotificationsReadUseCase");
const NotificationRepositoryImpl_1 = require("../../database/repositories/NotificationRepositoryImpl");
const NotificationRealtimePublisher_1 = require("../../realtime/publisher/NotificationRealtimePublisher");
const NotificationController_1 = require("../../../interface/controllers/notification/NotificationController");
const DITypes_1 = require("../../../shared/constants/DITypes");
class NotificationFactory {
    static register(container) {
        // Repository
        container
            .bind(DITypes_1.TYPES.NotificationRepository)
            .to(NotificationRepositoryImpl_1.NotificationRepositoryImpl)
            .inSingletonScope();
        // Use Cases
        container
            .bind(DITypes_1.TYPES.CreateNotificationUseCase)
            .to(CreateNotificationUseCase_1.CreateNotificationUseCase);
        container
            .bind(DITypes_1.TYPES.GetNotificationsUseCase)
            .to(GetNotificationsUseCase_1.GetNotificationsUseCase);
        container
            .bind(DITypes_1.TYPES.MarkNotificationsReadUseCase)
            .to(MarkNotificationsReadUseCase_1.MarkNotificationsReadUseCase);
        container
            .bind(DITypes_1.TYPES.NotificationPersistenceService)
            .to(NotificationPersistenceService_1.NotificationPersistenceService)
            .inSingletonScope();
        // Controller
        container
            .bind(DITypes_1.TYPES.NotificationController)
            .to(NotificationController_1.NotificationController);
    }
    static registerRealtimePublisher(container) {
        container
            .bind(DITypes_1.TYPES.NotificationRealtimePublisher)
            .to(NotificationRealtimePublisher_1.NotificationRealtimePublisher)
            .inSingletonScope();
    }
}
exports.NotificationFactory = NotificationFactory;
//# sourceMappingURL=NotificationFactory.js.map