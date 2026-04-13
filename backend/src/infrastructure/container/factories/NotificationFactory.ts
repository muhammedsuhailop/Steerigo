import { INotificationRealtimePublisher } from "@application/services/INotificationRealtimePublisher";
import {
  INotificationPersistenceService,
  NotificationPersistenceService,
} from "@application/services/NotificationPersistenceService";
import { CreateNotificationUseCase } from "@application/use-cases/notification/CreateNotificationUseCase";
import { GetNotificationsUseCase } from "@application/use-cases/notification/GetNotificationsUseCase";
import { MarkNotificationsReadUseCase } from "@application/use-cases/notification/MarkNotificationsReadUseCase";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { NotificationRepositoryImpl } from "@infrastructure/database/repositories/NotificationRepositoryImpl";
import { NotificationRealtimePublisher } from "@infrastructure/realtime/publisher/NotificationRealtimePublisher";
import { NotificationController } from "@interface/controllers/notification/NotificationController";
import { TYPES } from "@shared/constants/DITypes";
import { Container } from "inversify";

export class NotificationFactory {
  static register(container: Container): void {
    // Repository
    container
      .bind<INotificationRepository>(TYPES.NotificationRepository)
      .to(NotificationRepositoryImpl)
      .inSingletonScope();

    // Use Cases
    container
      .bind<CreateNotificationUseCase>(TYPES.CreateNotificationUseCase)
      .to(CreateNotificationUseCase);

    container
      .bind<GetNotificationsUseCase>(TYPES.GetNotificationsUseCase)
      .to(GetNotificationsUseCase);

    container
      .bind<MarkNotificationsReadUseCase>(TYPES.MarkNotificationsReadUseCase)
      .to(MarkNotificationsReadUseCase);

    container
      .bind<INotificationPersistenceService>(
        TYPES.NotificationPersistenceService,
      )
      .to(NotificationPersistenceService)
      .inSingletonScope();

    // Controller
    container
      .bind<NotificationController>(TYPES.NotificationController)
      .to(NotificationController);
  }

  static registerRealtimePublisher(container: Container): void {
    container
      .bind<INotificationRealtimePublisher>(TYPES.NotificationRealtimePublisher)
      .to(NotificationRealtimePublisher)
      .inSingletonScope();
  }
}
