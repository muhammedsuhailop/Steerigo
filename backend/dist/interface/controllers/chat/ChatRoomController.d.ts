import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { CreateRideChatRoomDto } from "../../../application/dto/chat/CreateRideChatRoomDto";
import { GetRideChatRoomDto } from "../../../application/dto/chat/GetRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "../../../application/dto/chat/response/CreateRideChatRoomResponseDto";
import { GetRideChatRoomResponseDto } from "../../../application/dto/chat/response/GetRideChatRoomResponseDto";
export declare class ChatRoomController {
    private readonly createRideChatRoomUseCase;
    private readonly getRideChatRoomUseCase;
    constructor(createRideChatRoomUseCase: IUseCase<CreateRideChatRoomDto, Promise<Result<CreateRideChatRoomResponseDto>>>, getRideChatRoomUseCase: IUseCase<GetRideChatRoomDto, Promise<Result<GetRideChatRoomResponseDto>>>);
    private getUserId;
    createRideChatRoom(req: Request, res: Response): Promise<void>;
    getRideChatRoom(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ChatRoomController.d.ts.map