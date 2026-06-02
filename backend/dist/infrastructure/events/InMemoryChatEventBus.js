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
exports.InMemoryChatEventBus = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
let InMemoryChatEventBus = class InMemoryChatEventBus {
    constructor(chatRealtimeService) {
        this.chatRealtimeService = chatRealtimeService;
    }
    async publish(event) {
        switch (event.type) {
            case "ChatMessageSent":
                return this.handleMessageSent(event);
            case "ChatMessageEdited":
                return this.handleMessageEdited(event);
            case "ChatMessageDeleted":
                return this.handleMessageDeleted(event);
            case "ChatMessageViewed":
                return this.handleMessageViewed(event);
            default: {
                const exhaustiveCheck = event;
                Logger_1.Logger.warn("Unhandled chat event", { event: exhaustiveCheck });
                return;
            }
        }
    }
    async handleMessageSent(event) {
        await this.chatRealtimeService.notifyMessageSent(event.payload);
    }
    async handleMessageEdited(event) {
        await this.chatRealtimeService.notifyMessageEdited(event.payload);
    }
    async handleMessageDeleted(event) {
        await this.chatRealtimeService.notifyMessageDeleted(event.payload);
    }
    async handleMessageViewed(event) {
        await this.chatRealtimeService.notifyMessageViewed(event.payload);
    }
};
exports.InMemoryChatEventBus = InMemoryChatEventBus;
exports.InMemoryChatEventBus = InMemoryChatEventBus = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRealtimeService)),
    __metadata("design:paramtypes", [Object])
], InMemoryChatEventBus);
//# sourceMappingURL=InMemoryChatEventBus.js.map