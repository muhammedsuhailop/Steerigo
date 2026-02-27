import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { IUseCase } from "../interfaces/IUseCase";
import { CreateNotificationDto } from "@application/dto/notification/CreateNotificationDto";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { Notification } from "@domain/entities/Notification";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { NOTIFICATION_MESSAGES } from "@shared/constants/NotificationMessages";

export interface CreateNotificationResponseDto {
  success: boolean;
  message: string;
  data: { notificationId: string };
}

@injectable()
export class CreateNotificationUseCase
  implements
    IUseCase<
      CreateNotificationDto,
      Promise<Result<CreateNotificationResponseDto>>
    >
{
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    dto: CreateNotificationDto,
  ): Promise<Result<CreateNotificationResponseDto>> {
    try {
      Logger.info("Creating notification", {
        recipientId: dto.getRecipientId(),
        type: dto.getType(),
        channel: dto.getChannel(),
      });

      const notification = Notification.create({
        id: new Types.ObjectId().toString(),
        recipientId: dto.getRecipientId(),
        type: dto.getType(),
        channel: dto.getChannel(),
        title: dto.getTitle(),
        body: dto.getBody(),
        metadata: dto.getMetadata(),
      });

      const saved = await this.notificationRepository.save(notification);

      Logger.info("Notification created successfully", {
        id: saved.getId(),
        recipientId: saved.getRecipientId(),
        type: saved.getType(),
      });

      return Result.success({
        success: true,
        message: NOTIFICATION_MESSAGES.CREATED_SUCCESSFULLY,
        data: { notificationId: saved.getId() },
      });
    } catch (error) {
      Logger.error("Error creating notification", {
        recipientId: dto.getRecipientId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }
}
