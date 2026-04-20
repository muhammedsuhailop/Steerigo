import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { EditChatMessageDto } from "@application/dto/chat/EditChatMessageDto";
import { EditChatMessageResponseDto } from "@application/dto/chat/response/EditChatMessageResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";

@injectable()
export class EditChatMessageUseCase
  implements
    IUseCase<EditChatMessageDto, Promise<Result<EditChatMessageResponseDto>>>
{
  constructor(
    @inject(TYPES.MessageRepository)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(
    dto: EditChatMessageDto,
  ): Promise<Result<EditChatMessageResponseDto>> {
    try {
      const userId = dto.getUserId();
      const messageId = dto.getMessageId();
      const newContent = dto.getContent();

      Logger.info("Editing chat message", { userId, messageId });

      const message = await this.messageRepository.findById(messageId);
      if (!message) {
        return Result.failure(ChatErrors.messageNotFound(messageId));
      }

      if (message.getSenderId() !== userId) {
        return Result.failure(
          ChatErrors.unauthorizedMessageAccess(messageId, userId),
        );
      }

      if (!message.canBeEdited()) {
        return Result.failure(ChatErrors.messageEditWindowExpired(messageId));
      }

      message.edit(newContent);

      const savedMessage = await this.messageRepository.save(message);

      const response: EditChatMessageResponseDto = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.EDITED,
        data: {
          id: savedMessage.getId(),
          chatRoomId: savedMessage.getChatRoomId(),
          senderId: savedMessage.getSenderId(),
          content: savedMessage.getContent(),
          type: savedMessage.getType(),
          createdAt: savedMessage.getCreatedAt().toISOString(),
          updatedAt: savedMessage.getUpdatedAt().toISOString(),
          editedAt: savedMessage.getEditedAt()?.toISOString(),
        },
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("EditChatMessageUseCase failed", {
        userId: dto.getUserId(),
        messageId: dto.getMessageId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
