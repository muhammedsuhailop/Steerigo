"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRealtimePublisher = void 0;
const inversify_1 = require("inversify");
const NotificationSocketAdapter_1 = require("@infrastructure/adapters/NotificationSocketAdapter");
const Logger_1 = require("@shared/utils/Logger");
let NotificationRealtimePublisher = class NotificationRealtimePublisher {
    emitToUser(userId, notificationId, type, title, body, metadata) {
        try {
            const payload = {
                notificationId,
                type,
                title,
                body,
                metadata,
                createdAt: new Date().toISOString(),
            };
            NotificationSocketAdapter_1.NotificationSocketAdapter.emitToUser(userId, payload);
            Logger_1.Logger.debug("Realtime notification emitted", {
                userId,
                notificationId,
                type,
            });
        }
        catch (error) {
            Logger_1.Logger.error("NotificationRealtimePublisher emit failed", {
                userId,
                notificationId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
};
exports.NotificationRealtimePublisher = NotificationRealtimePublisher;
exports.NotificationRealtimePublisher = NotificationRealtimePublisher = __decorate([
    (0, inversify_1.injectable)()
], NotificationRealtimePublisher);
//# sourceMappingURL=NotificationRealtimePublisher.js.map