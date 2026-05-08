import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { GetNotificationsDto } from "@application/dto/notification/GetNotificationsDto";
import { GetNotificationsResponseDto } from "@application/dto/notification/GetNotificationsResponseDto";
import { MarkNotificationsReadDto } from "@application/dto/notification/MarkNotificationsReadDto";
import { MarkNotificationsReadResponseDto } from "@application/dto/notification/MarkNotificationsReadResponseDto";
import { INotificationRealtimePublisher } from "@application/services/INotificationRealtimePublisher";
import {
  INotificationPersistenceService,
  NotificationPersistenceService,
} from "@application/services/NotificationPersistenceService";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  CreateNotificationResponseDto,
  CreateNotificationUseCase,
} from "@application/use-cases/notification/CreateNotificationUseCase";
import { GetNotificationsUseCase } from "@application/use-cases/notification/GetNotificationsUseCase";
import { MarkNotificationsReadUseCase } from "@application/use-cases/notification/MarkNotificationsReadUseCase";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { NotificationRepositoryImpl } from "@infrastructure/database/repositories/NotificationRepositoryImpl";
import { NotificationRealtimePublisher } from "@infrastructure/realtime/publisher/NotificationRealtimePublisher";
import { NotificationController } from "@interface/controllers/notification/NotificationController";
import { TYPES } from "@shared/constants/DITypes";
import { Result } from "@shared/utils/Result";
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
      .bind<
        IUseCase<
          CreateNotificationDto,
          Promise<Result<CreateNotificationResponseDto>>
        >
      >(TYPES.CreateNotificationUseCase)
      .to(CreateNotificationUseCase);

    container
      .bind<
        IUseCase<
          GetNotificationsDto,
          Promise<Result<GetNotificationsResponseDto>>
        >
      >(TYPES.GetNotificationsUseCase)
      .to(GetNotificationsUseCase);

    container
      .bind<
        IUseCase<
          MarkNotificationsReadDto,
          Promise<Result<MarkNotificationsReadResponseDto>>
        >
      >(TYPES.MarkNotificationsReadUseCase)
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
