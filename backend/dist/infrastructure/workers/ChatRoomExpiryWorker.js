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
exports.ChatRoomExpiryWorker = void 0;
const bullmq_1 = require("bullmq");
const inversify_1 = require("inversify");
const DITypes_1 = require("../../shared/constants/DITypes");
const BullMQConnection_1 = require("../queues/BullMQConnection");
const AppConstants_1 = require("../../shared/constants/AppConstants");
const Logger_1 = require("../../shared/utils/Logger");
const ChatRoomStatus_1 = require("../../domain/value-objects/ChatRoomStatus");
let ChatRoomExpiryWorker = class ChatRoomExpiryWorker {
    constructor(chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }
    start() {
        this.worker = new bullmq_1.Worker(AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_QUEUE_NAME, async (job) => this.process(job), {
            connection: (0, BullMQConnection_1.getBullMQConnection)(),
            concurrency: 5,
        });
        this.worker.on("completed", (job) => {
            Logger_1.Logger.info("Chat room expiry job completed", {
                jobId: job.id,
                name: job.name,
            });
        });
        this.worker.on("failed", (job, error) => {
            Logger_1.Logger.error("Chat room expiry job failed", {
                jobId: job?.id,
                name: job?.name,
                error: error.message,
            });
        });
        Logger_1.Logger.info("ChatRoomExpiryWorker started");
    }
    async close() {
        await this.worker?.close();
    }
    async process(job) {
        switch (job.name) {
            case AppConstants_1.AppConstants.CHAT_ROOM_EXPIRY_JOB_NAME:
                await this.handleChatRoomEnd(job);
                return;
            default:
                Logger_1.Logger.warn("Unknown chat room expiry job received", {
                    jobId: job.id,
                    name: job.name,
                });
        }
    }
    async handleChatRoomEnd(job) {
        const { chatRoomId, rideId } = job.data;
        Logger_1.Logger.info("Chat room expiry triggered", {
            jobId: job.id,
            chatRoomId,
            rideId,
        });
        const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
        if (!chatRoom) {
            Logger_1.Logger.warn("Chat room not found during expiry — skipping", {
                chatRoomId,
                rideId,
            });
            return;
        }
        if (chatRoom.getStatus() === ChatRoomStatus_1.ChatRoomStatus.ENDED) {
            Logger_1.Logger.info("Chat room already ended — skipping expiry job", {
                chatRoomId,
                rideId,
            });
            return;
        }
        chatRoom.end();
        await this.chatRoomRepository.save(chatRoom);
        Logger_1.Logger.info("Chat room ended after 1 day expiry", {
            chatRoomId,
            rideId,
        });
    }
};
exports.ChatRoomExpiryWorker = ChatRoomExpiryWorker;
exports.ChatRoomExpiryWorker = ChatRoomExpiryWorker = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __metadata("design:paramtypes", [Object])
], ChatRoomExpiryWorker);
//# sourceMappingURL=ChatRoomExpiryWorker.js.map