"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomController = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const CreateRideChatRoomDto_1 = require("../../../application/dto/chat/CreateRideChatRoomDto");
const GetRideChatRoomDto_1 = require("../../../application/dto/chat/GetRideChatRoomDto");
const ChatMessages_1 = require("../../../shared/constants/ChatMessages");
let ChatRoomController = class ChatRoomController {
    constructor(createRideChatRoomUseCase, getRideChatRoomUseCase) {
        this.createRideChatRoomUseCase = createRideChatRoomUseCase;
        this.getRideChatRoomUseCase = getRideChatRoomUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async createRideChatRoom(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            const dto = CreateRideChatRoomDto_1.CreateRideChatRoomDto.fromRequest(userId, {
                rideId,
            });
            const result = await this.createRideChatRoomUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: ChatMessages_1.CHAT_MESSAGES.CHAT_ROOM.CREATED,
                data: result.getValue(),
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Create ride chat room controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getRideChatRoom(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            const dto = GetRideChatRoomDto_1.GetRideChatRoomDto.fromRequest(userId, { rideId });
            const result = await this.getRideChatRoomUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: ChatMessages_1.CHAT_MESSAGES.CHAT_ROOM.RIDE_ROOM_FETCHED,
                data: result.getValue(),
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get ride chat room controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.ChatRoomController = ChatRoomController;
exports.ChatRoomController = ChatRoomController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CreateRideChatRoomUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetRideChatRoomUseCase)),
    __metadata("design:paramtypes", [Object, Object])
], ChatRoomController);
//# sourceMappingURL=ChatRoomController.js.map