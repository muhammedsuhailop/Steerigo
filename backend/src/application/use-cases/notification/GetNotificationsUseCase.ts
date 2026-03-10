import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetNotificationsDto } from "@application/dto/notification/GetNotificationsDto";
import {
  GetNotificationsResponseDto,
  NotificationData,
} from "@application/dto/notification/GetNotificationsResponseDto";
import { INotificationRepository } from "@domain/repositories/INotificationRepository";
import { Notification } from "@domain/entities/Notification";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { NOTIFICATION_MESSAGES } from "@shared/constants/NotificationMessages";

@injectable()
export class GetNotificationsUseCase
  implements
    IUseCase<GetNotificationsDto, Promise<Result<GetNotificationsResponseDto>>>
{
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}

  async execute(
    dto: GetNotificationsDto,
  ): Promise<Result<GetNotificationsResponseDto>> {
    try {
      Logger.info("Fetching notifications", {
        userId: dto.getUserId(),
        page: dto.getPage(),
        isRead: dto.getIsRead(),
      });

      const [paginatedResult, unreadCount] = await Promise.all([
        this.notificationRepository.findByRecipientId(dto.getUserId(), {
          page: dto.getPage(),
          limit: dto.getLimit(),
          sortOrder: dto.getSortOrder(),
          isRead: dto.getIsRead(),
          type: dto.getType(),
          channel: dto.getChannel(),
          fromDate: dto.getFromDate(),
          toDate: dto.getToDate(),
        }),
        this.notificationRepository.countUnread(dto.getUserId()),
      ]);

      const notifications: NotificationData[] = paginatedResult.data.map((n) =>
        this.mapToNotificationData(n),
      );

      Logger.info("Notifications fetched successfully", {
        userId: dto.getUserId(),
        total: paginatedResult.total,
        unreadCount,
      });

      return Result.success({
        success: true,
        message: NOTIFICATION_MESSAGES.FETCHED_SUCCESSFULLY,
        data: {
          notifications,
          unreadCount,
          pagination: {
            total: paginatedResult.total,
            page: paginatedResult.page,
            limit: paginatedResult.limit,
            totalPages: paginatedResult.totalPages,
          },
        },
      });
    } catch (error) {
      Logger.error("Error fetching notifications", {
        userId: dto.getUserId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private mapToNotificationData(notification: Notification): NotificationData {
    return {
      id: notification.getId(),
      type: notification.getType(),
      channel: notification.getChannel(),
      title: notification.getTitle(),
      body: notification.getBody(),
      metadata: notification.getMetadata(),
      isRead: notification.getIsRead(),
      readAt: notification.getReadAt()?.toISOString(),
      createdAt: notification.getCreatedAt().toISOString(),
      updatedAt: notification.getUpdatedAt().toISOString(),
    };
  }
}
