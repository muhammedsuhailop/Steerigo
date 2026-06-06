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
exports.ChatRoomExpiryService = void 0;
const inversify_1 = require("inversify");
const bullmq_1 = require("bullmq");
const DITypes_1 = require("../../shared/constants/DITypes");
const AppConstants_1 = require("../../shared/constants/AppConstants");
const Logger_1 = require("../../shared/utils/Logger");
let ChatRoomExpiryService = class ChatRoomExpiryService {
    constructor(expiryQueue) {
        this.expiryQueue = expiryQueue;
    }
    async scheduleChatRoomEnd(rideId, chatRoomId) {
        await this.expiryQueue.add(AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_JOB_NAME, { rideId, chatRoomId }, {
            jobId: this.buildJobId(chatRoomId),
            delay: AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_DELAY_MS,
            removeOnComplete: true,
            removeOnFail: true,
        });
        Logger_1.Logger.info("Chat room end scheduled", {
            chatRoomId,
            rideId,
            endsInMs: AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_DELAY_MS,
        });
    }
    async scheduleChatRoomEndAfterCancellation(rideId, chatRoomId) {
        await this.expiryQueue.add(AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_JOB_NAME, { rideId, chatRoomId }, {
            jobId: this.buildJobId(chatRoomId),
            delay: AppConstants_1.AppConstants.CHAT_ROOM_CANCELLATION_EXPIRY_DELAY_MS,
            removeOnComplete: true,
            removeOnFail: true,
        });
        Logger_1.Logger.info("Chat room end scheduled after cancellation", {
            chatRoomId,
            rideId,
            endsInMs: AppConstants_1.AppConstants.CHAT_ROOM_CANCELLATION_EXPIRY_DELAY_MS,
        });
    }
    async cancelChatRoomEnd(chatRoomId) {
        const job = await this.expiryQueue.getJob(this.buildJobId(chatRoomId));
        if (job) {
            await job.remove();
            Logger_1.Logger.info("Chat room end job cancelled", { chatRoomId });
        }
    }
    buildJobId(chatRoomId) {
        return `chat-room-expiry-${chatRoomId}`;
    }
};
exports.ChatRoomExpiryService = ChatRoomExpiryService;
exports.ChatRoomExpiryService = ChatRoomExpiryService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomExpiryQueue)),
    __metadata("design:paramtypes", [bullmq_1.Queue])
], ChatRoomExpiryService);
//# sourceMappingURL=ChatRoomExpiryService.js.map