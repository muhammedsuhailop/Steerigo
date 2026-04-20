import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { GetChatMessagesDto } from "@application/dto/chat/GetChatMessagesDto";
import { GetChatMessagesResponseDto } from "@application/dto/chat/response/GetChatMessagesResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";

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
        Logger.warn("Unauthorized chat access attempt", { userId, chatRoomId });
        return Result.failure(
          ChatErrors.unauthorizedChatAccess(chatRoomId, userId),
        );
      }

      const paginatedMessages =
        await this.messageRepository.findPaginatedByChatRoomId(chatRoomId, {
          page: dto.getPage(),
          limit: dto.getLimit(),
          sortOrder: dto.getSortOrder(),
          type: undefined,
        });

      const response: GetChatMessagesResponseDto = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.FETCHED,
        data: {
          messages: paginatedMessages.data.map((message) => ({
            id: message.getId(),
            chatRoomId: message.getChatRoomId(),
            senderId: message.getSenderId(),
            content: message.isDeleted()
              ? "Message deleted"
              : message.getContent(),
            type: message.getType(),
            createdAt: message.getCreatedAt().toISOString(),
            updatedAt: message.getUpdatedAt().toISOString(),
            editedAt: message.getEditedAt()?.toISOString(),
            deletedAt: message.getDeletedAt()?.toISOString(),
            isDeleted: message.isDeleted(),
          })),
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
