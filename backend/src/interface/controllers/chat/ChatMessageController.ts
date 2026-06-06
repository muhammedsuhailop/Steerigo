import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetChatMessagesDto } from "@application/dto/chat/GetChatMessagesDto";
import { SendChatMessageDto } from "@application/dto/chat/SendChatMessageDto";
import { GetChatMessagesResponseDto } from "@application/dto/chat/response/GetChatMessagesResponseDto";
import { SendChatMessageResponseDto } from "@application/dto/chat/response/SendChatMessageResponseDto";
import { EditChatMessageDto } from "@application/dto/chat/EditChatMessageDto";
import { EditChatMessageResponseDto } from "@application/dto/chat/response/EditChatMessageResponseDto";
import { DeleteChatMessageDto } from "@application/dto/chat/DeleteChatMessageDto";
import { DeleteChatMessageResponseDto } from "@application/dto/chat/response/DeleteChatMessageResponseDto";
import { ApiResponse } from "@shared/types/Common";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";

@injectable()
export class ChatMessageController {
  constructor(
    @inject(TYPES.GetChatMessagesUseCase)
    private readonly getChatMessagesUseCase: IUseCase<
      GetChatMessagesDto,
      Promise<Result<GetChatMessagesResponseDto>>
    >,
    @inject(TYPES.SendChatMessageUseCase)
    private readonly sendChatMessageUseCase: IUseCase<
      SendChatMessageDto,
      Promise<Result<SendChatMessageResponseDto>>
    >,
    @inject(TYPES.EditChatMessageUseCase)
    private readonly editChatMessageUseCase: IUseCase<
      EditChatMessageDto,
      Promise<Result<EditChatMessageResponseDto>>
    >,
    @inject(TYPES.DeleteChatMessageUseCase)
    private readonly deleteChatMessageUseCase: IUseCase<
      DeleteChatMessageDto,
      Promise<Result<DeleteChatMessageResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const chatRoomId = req.params.chatRoomId;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 20;
      const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

      const dto = GetChatMessagesDto.fromRequest(userId as string, {
        chatRoomId,
        page,
        limit,
        sortOrder,
      });

      const result = await this.getChatMessagesUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.FETCHED,
        data: result.getValue(),
      };
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Get chat messages controller error", {
        userId: this.getUserId(req),
        chatRoomId: req.params.chatRoomId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);
      const chatRoomId = req.params.chatRoomId;

      const content =
        typeof req.body?.content === "string" ? req.body.content : "";

      const dto = SendChatMessageDto.fromRequest(userId as string, {
        chatRoomId,
        content,
      });

      const result = await this.sendChatMessageUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.SEND_SUCCESS,
        data: result.getValue(),
      };
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Send chat message controller error", {
        userId: this.getUserId(req),
        chatRoomId: req.params.chatRoomId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async editMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const messageId = req.params.messageId;
      const content =
        typeof req.body?.content === "string" ? req.body.content : "";

      const dto = EditChatMessageDto.fromRequest(userId as string, {
        messageId,
        content,
      });

      const result = await this.editChatMessageUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.EDITED,
        data: result.getValue(),
      };
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const messageId = req.params.messageId;

      const dto = DeleteChatMessageDto.fromRequest(userId as string, {
        messageId,
      });

      const result = await this.deleteChatMessageUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: CHAT_MESSAGES.MESSAGES.DELETED,
        data: result.getValue(),
      };
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
