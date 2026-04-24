import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { MarkChatMessagesReadDto } from "@application/dto/chat/MarkChatMessagesReadDto";
import { MarkChatMessagesReadResponseDto } from "@application/dto/chat/response/MarkChatMessagesReadResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { MessageDeliveryStatus } from "@domain/value-objects/MessageDeliveryStatus";
import { IChatEventBus } from "@application/services/IChatEventBus";
import { ChatMessageViewedEvent } from "@application/events/ChatEvents";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";

@injectable()
export class MarkChatMessagesReadUseCase
  implements
    IUseCase<
      MarkChatMessagesReadDto,
      Promise<Result<MarkChatMessagesReadResponseDto>>
    >
{
  constructor(
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,
    @inject(TYPES.MessageRepository)
    private readonly messageRepository: IMessageRepository,
    @inject(TYPES.UserChatRepository)
    private readonly userChatRepository: IUserChatRepository,
    @inject(TYPES.MessageStatusRepository)
    private readonly messageStatusRepository: IMessageStatusRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.ChatEventBus)
    private readonly chatEventBus: IChatEventBus,
  ) {}

  async execute(
    dto: MarkChatMessagesReadDto,
  ): Promise<Result<MarkChatMessagesReadResponseDto>> {
    try {
      const userId = dto.getUserId();
      const chatRoomId = dto.getChatRoomId();
      const messageId = dto.getMessageId();

      const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
      if (!chatRoom) {
        return Result.failure(ChatErrors.chatRoomNotFound(chatRoomId));
      }

      let resolvedUserId = userId;
      let isAuthorized = chatRoom.isParticipant(userId);

      if (!isAuthorized) {
        const driverProfile = await this.driverRepository.findByUserId(userId);
        if (driverProfile) {
          const driverId = driverProfile.getId();
          if (chatRoom.isParticipant(driverId)) {
            isAuthorized = true;
            resolvedUserId = driverId;
          }
        }
      }

      if (!isAuthorized) {
        return Result.failure(
          ChatErrors.unauthorizedChatAccess(chatRoomId, userId),
        );
      }

      const message = await this.messageRepository.findById(messageId);
      if (!message || message.getChatRoomId() !== chatRoomId) {
        return Result.failure(ChatErrors.messageNotFound(messageId));
      }

      const userChat = await this.userChatRepository.findByUserIdAndChatRoomId(
        resolvedUserId,
        chatRoomId,
      );

      if (userChat) {
        userChat.markAsRead(messageId);
        await this.userChatRepository.save(userChat);
      }

      const status =
        await this.messageStatusRepository.findByMessageIdAndUserId(
          messageId,
          resolvedUserId,
        );

      if (status) {
        status.markRead();
        await this.messageStatusRepository.save(status);
      } else if (message.getSenderId() !== resolvedUserId) {
        Logger.warn(
          `No MessageStatus found for message ${messageId} and user ${resolvedUserId}`,
        );
      }

      const seenAt = new Date();

      const event: ChatMessageViewedEvent = {
        type: "ChatMessageViewed",
        occurredAt: seenAt,
        payload: {
          chatRoomId,
          messageId,
          viewerId: resolvedUserId,
          status: MessageDeliveryStatus.READ,
          seenAt: seenAt.toISOString(),
        },
      };

      await this.chatEventBus.publish(event);

      return Result.success({
        success: true,
        message: "Chat message marked as read",
        data: {
          chatRoomId,
          messageId,
          userId: resolvedUserId,
          status: MessageDeliveryStatus.READ,
          seenAt: seenAt.toISOString(),
        },
      });
    } catch (error) {
      Logger.error("MarkChatMessagesReadUseCase failed", {
        userId: dto.getUserId(),
        chatRoomId: dto.getChatRoomId(),
        messageId: dto.getMessageId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
