"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentNotificationService = void 0;
const inversify_1 = require("inversify");
const socket_1 = require("../realtime/socket");
const Logger_1 = require("../../shared/utils/Logger");
const SocketEvents_1 = require("../realtime/constants/SocketEvents");
let PaymentNotificationService = class PaymentNotificationService {
    async notifyPaymentInitiated(riderId, payload) {
        try {
            const io = (0, socket_1.getRideSocketServer)();
            io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_INITIATED, payload);
            Logger_1.Logger.info("Notified payment initiated", {
                riderId,
                paymentId: payload.paymentId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying payment initiated", {
                riderId,
                error,
            });
        }
    }
    async notifyPaymentSucceeded(riderId, driverId, driverUserId, payload) {
        try {
            const io = (0, socket_1.getRideSocketServer)();
            io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_COMPLETED, payload);
            io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_COMPLETED, payload);
            io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_COMPLETED, payload);
            Logger_1.Logger.info("Notified payment success", {
                riderId,
                paymentId: payload.paymentId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying payment success", {
                riderId,
                error,
            });
        }
    }
    async notifyPaymentFailed(riderId, driverUserId, payload) {
        try {
            const io = (0, socket_1.getRideSocketServer)();
            io.to(`rider:${riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_FAILED, payload);
            io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_FAILED, payload);
            io.to(`driver:${driverUserId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_FAILED, payload);
            Logger_1.Logger.warn("Notified payment failed", {
                riderId,
                paymentId: payload.paymentId,
                reason: payload.reason,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying payment failed", {
                riderId,
                error,
            });
        }
    }
    async notifyPaymentCashConfirmed(driverId, payload) {
        try {
            const io = (0, socket_1.getRideSocketServer)();
            io.to(`driver:${driverId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_CASH_CONFIRMED, payload);
            io.to(`rider:${payload.riderId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_COMPLETED, payload);
            io.to(`ride:${payload.rideId}`).emit(SocketEvents_1.SOCKET_EVENTS.PAYMENT_COMPLETED, payload);
            Logger_1.Logger.info("Notified cash payment confirmed to driver and ride room", {
                driverId,
                rideId: payload.rideId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error notifying cash payment confirmed", {
                driverId,
                error,
            });
        }
    }
};
exports.PaymentNotificationService = PaymentNotificationService;
exports.PaymentNotificationService = PaymentNotificationService = __decorate([
    (0, inversify_1.injectable)()
], PaymentNotificationService);
//# sourceMappingURL=PaymentNotificationService.js.map