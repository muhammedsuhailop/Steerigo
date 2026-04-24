import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { DeleteChatMessageDto } from "@application/dto/chat/DeleteChatMessageDto";
import { DeleteChatMessageResponseDto } from "@application/dto/chat/response/DeleteChatMessageResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { IChatEventBus } from "@application/services/IChatEventBus";
import { ChatMessageDeletedEvent } from "@application/events/ChatEvents";

@injectable()
export class DeleteChatMessageUseCase
  implements
    IUseCase<
      DeleteChatMessageDto,
      Promise<Result<DeleteChatMessageResponseDto>>
    >
{
  constructor(
    @inject(TYPES.MessageRepository)
    private readonly messageRepository: IMessageRepository,
    @inject(TYPES.ChatEventBus)
    private readonly chatEventBus: IChatEventBus,
  ) {}

  async execute(
    dto: DeleteChatMessageDto,
  ): Promise<Result<DeleteChatMessageResponseDto>> {
    try {
      const userId = dto.getUserId();
      const messageId = dto.getMessageId();

      Logger.info("Deleting chat message", { userId, messageId });

      const message = await this.messageRepository.findById(messageId);
      if (!message) {
        return Result.failure(ChatErrors.messageNotFound(messageId));
      }

      if (message.getSenderId() !== userId) {
        return Result.failure(
          ChatErrors.unauthorizedMessageAccess(messageId, userId),
        );
      }

      if (message.isDeleted()) {
        const response: DeleteChatMessageResponseDto = {
          success: true,
          message: "Chat message already deleted",
          data: {
            id: message.getId(),
            chatRoomId: message.getChatRoomId(),
            senderId: message.getSenderId(),
            deletedAt: message.getDeletedAt()!.toISOString(),
            isDeleted: true,
          },
        };

        return Result.success(response);
      }

      await this.messageRepository.softDelete(messageId);

      const deletedAt = new Date();

      const event: ChatMessageDeletedEvent = {
        type: "ChatMessageDeleted",
        occurredAt: deletedAt,
        payload: {
          chatRoomId: message.getChatRoomId(),
          messageId: message.getId(),
          senderId: message.getSenderId(),
          deletedAt: deletedAt.toISOString(),
        },
      };

      await this.chatEventBus.publish(event);

      const response: DeleteChatMessageResponseDto = {
        success: true,
        message: "Chat message deleted successfully",
        data: {
          id: message.getId(),
          chatRoomId: message.getChatRoomId(),
          senderId: message.getSenderId(),
          deletedAt: deletedAt.toISOString(),
          isDeleted: true,
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("DeleteChatMessageUseCase failed", {
        userId: dto.getUserId(),
        messageId: dto.getMessageId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
