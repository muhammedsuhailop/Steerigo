import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { GetChatMessagesDto } from "@application/dto/chat/GetChatMessagesDto";
import { GetChatMessagesResponseDto } from "@application/dto/chat/response/GetChatMessagesResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";

@injectable()
export class GetChatMessagesUseCase
  implements
    IUseCase<GetChatMessagesDto, Promise<Result<GetChatMessagesResponseDto>>>
{
  constructor(
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,

    @inject(TYPES.MessageRepository)
    private readonly messageRepository: IMessageRepository,

    @inject(TYPES.MessageStatusRepository)
    private readonly messageStatusRepository: IMessageStatusRepository,

    @inject(TYPES.UserChatRepository)
    private readonly userChatRepository: IUserChatRepository,

    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(
    dto: GetChatMessagesDto,
  ): Promise<Result<GetChatMessagesResponseDto>> {
    try {
      const userId = dto.getUserId();
      const chatRoomId = dto.getChatRoomId();

      Logger.info("Fetching chat messages", {
        userId,
        chatRoomId,
        page: dto.getPage(),
        limit: dto.getLimit(),
      });

      const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
      if (!chatRoom) {
        return Result.failure(ChatErrors.chatRoomNotFound(chatRoomId));
      }

      let isAuthorized = chatRoom.isParticipant(userId);

      if (!isAuthorized) {
        const driverProfile = await this.driverRepository.findByUserId(userId);

        if (driverProfile) {
          const driverId = driverProfile.getId();
          isAuthorized = chatRoom.isParticipant(driverId);

          Logger.debug("Chat access resolved via Driver Profile", {
            userId,
            resolvedDriverId: driverId,
            isAuthorized,
          });
        }
      }

      if (!isAuthorized) {
        Logger.warn("Unauthorized chat access attempt", {
          userId,
          chatRoomId,
        });

        return Result.failure(
          ChatErrors.unauthorizedChatAccess(chatRoomId, userId),
        );
      }

      const paginatedMessages =
        await this.messageRepository.findPaginatedByChatRoomId(chatRoomId, {
          page: dto.getPage(),
          limit: dto.getLimit(),
          sortOrder: dto.getSortOrder(),
        });

      const userChat = await this.userChatRepository.findByUserIdAndChatRoomId(
        userId,
        chatRoomId,
      );

      const unreadCount = userChat ? userChat.getUnreadCount() : 0;

      const totalUnreadCount =
        await this.userChatRepository.getTotalUnreadCountByUserId(userId);

      const messageIds = paginatedMessages.data.map((m) => m.getId());

      const statuses =
        messageIds.length > 0
          ? await this.messageStatusRepository.findByMessageIdsAndUserId(
              messageIds,
              userId,
            )
          : [];

      const statusMap = new Map<
        string,
        { status: MessageDeliveryStatus; readAt?: string }
      >();

      for (const status of statuses) {
        statusMap.set(status.getMessageId(), {
          status: status.getStatus(),
        });
      }

      const response: GetChatMessagesResponseDto = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.FETCHED,
        data: {
          messages: paginatedMessages.data.map((message) => ({
            id: message.getId(),
            chatRoomId: message.getChatRoomId(),
            senderId: message.getSenderId(),
            content: message.getContent(),
            type: message.getType(),
            createdAt: message.getCreatedAt().toISOString(),
            updatedAt: message.getUpdatedAt().toISOString(),
            editedAt: message.getEditedAt()?.toISOString(),
            deletedAt: message.getDeletedAt()?.toISOString(),
            isDeleted: message.isDeleted(),

            messageStatus: statusMap.get(message.getId()) ?? null,
          })),

          unreadCount,
          totalUnreadCount,

          pagination: {
            total: paginatedMessages.total,
            page: paginatedMessages.page,
            limit: paginatedMessages.limit,
            totalPages: paginatedMessages.totalPages,
          },
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("GetChatMessagesUseCase failed", {
        userId: dto.getUserId(),
        chatRoomId: dto.getChatRoomId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
