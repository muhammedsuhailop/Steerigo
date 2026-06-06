import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { GetRideChatRoomDto } from "@application/dto/chat/GetRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { GetRideChatRoomResponseDto } from "@application/dto/chat/response/GetRideChatRoomResponseDto";
import { ApiResponse } from "@shared/types/Common";
import { CHAT_MESSAGES } from "@shared/constants/ChatMessages";

@injectable()
export class ChatRoomController {
  constructor(
    @inject(TYPES.CreateRideChatRoomUseCase)
    private readonly createRideChatRoomUseCase: IUseCase<
      CreateRideChatRoomDto,
      Promise<Result<CreateRideChatRoomResponseDto>>
    >,
    @inject(TYPES.GetRideChatRoomUseCase)
    private readonly getRideChatRoomUseCase: IUseCase<
      GetRideChatRoomDto,
      Promise<Result<GetRideChatRoomResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async createRideChatRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const rideId = req.params.rideId;

      const dto = CreateRideChatRoomDto.fromRequest(userId as string, {
        rideId,
      });
      const result = await this.createRideChatRoomUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: CHAT_MESSAGES.CHAT_ROOM.CREATED,
        data: result.getValue(),
      };
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Create ride chat room controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }

  async getRideChatRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const rideId = req.params.rideId;

      const dto = GetRideChatRoomDto.fromRequest(userId as string, { rideId });
      const result = await this.getRideChatRoomUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(error);
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: CHAT_MESSAGES.CHAT_ROOM.RIDE_ROOM_FETCHED,
        data: result.getValue(),
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      Logger.error("Get ride chat room controller error", {
        userId: this.getUserId(req),
        rideId: req.params.rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      const { response, statusCode } = ErrorHandlerService.handleError(error);
      res.status(statusCode).json(response);
    }
  }
}
