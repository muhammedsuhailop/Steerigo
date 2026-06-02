import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { GetChatMessagesDto } from "../../../application/dto/chat/GetChatMessagesDto";
import { SendChatMessageDto } from "../../../application/dto/chat/SendChatMessageDto";
import { GetChatMessagesResponseDto } from "../../../application/dto/chat/response/GetChatMessagesResponseDto";
import { SendChatMessageResponseDto } from "../../../application/dto/chat/response/SendChatMessageResponseDto";
import { EditChatMessageDto } from "../../../application/dto/chat/EditChatMessageDto";
import { EditChatMessageResponseDto } from "../../../application/dto/chat/response/EditChatMessageResponseDto";
import { DeleteChatMessageDto } from "../../../application/dto/chat/DeleteChatMessageDto";
import { DeleteChatMessageResponseDto } from "../../../application/dto/chat/response/DeleteChatMessageResponseDto";
export declare class ChatMessageController {
    private readonly getChatMessagesUseCase;
    private readonly sendChatMessageUseCase;
    private readonly editChatMessageUseCase;
    private readonly deleteChatMessageUseCase;
    constructor(getChatMessagesUseCase: IUseCase<GetChatMessagesDto, Promise<Result<GetChatMessagesResponseDto>>>, sendChatMessageUseCase: IUseCase<SendChatMessageDto, Promise<Result<SendChatMessageResponseDto>>>, editChatMessageUseCase: IUseCase<EditChatMessageDto, Promise<Result<EditChatMessageResponseDto>>>, deleteChatMessageUseCase: IUseCase<DeleteChatMessageDto, Promise<Result<DeleteChatMessageResponseDto>>>);
    private getUserId;
    getMessages(req: Request, res: Response): Promise<void>;
    sendMessage(req: Request, res: Response): Promise<void>;
    editMessage(req: Request, res: Response): Promise<void>;
    deleteMessage(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ChatMessageController.d.ts.map