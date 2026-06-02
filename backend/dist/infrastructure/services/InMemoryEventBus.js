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
exports.InMemoryEventBus = void 0;
const inversify_1 = require("inversify");
const AvailabilityStatus_1 = require("@domain/value-objects/AvailabilityStatus");
const NotificationType_1 = require("@domain/value-objects/NotificationType");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
let InMemoryEventBus = class InMemoryEventBus {
    constructor(notificationService, persistence, paymentNotificationService, driverRepository, driverAvailabilityRepository, chatRoomExpiryService, chatRoomRepository) {
        this.notificationService = notificationService;
        this.persistence = persistence;
        this.paymentNotificationService = paymentNotificationService;
        this.driverRepository = driverRepository;
        this.driverAvailabilityRepository = driverAvailabilityRepository;
        this.chatRoomExpiryService = chatRoomExpiryService;
        this.chatRoomRepository = chatRoomRepository;
        // Store handlers in a map by event type
        this.handlers = new Map();
    }
    // Generic-safe subscription
    subscribe(eventType, handler) {
        const existingHandlers = this.handlers.get(eventType) ?? new Set();
        existingHandlers.add(handler);
        this.handlers.set(eventType, existingHandlers);
    }
    async publish(event) {
        await this.dispatchRegisteredHandlers(event);
        switch (event.type) {
            case "RideRequestCreated":
                return this.handleRideRequestCreated(event);
            case "RideMatched":
                return this.handleRideMatched(event);
            case "RideArrived":
                return this.handleRideArrived(event);
            case "RideStarted":
                return this.handleRideStarted(event);
            case "RideCompleted":
                return this.handleRideCompleted(event);
            case "PaymentInitiated":
                return this.handlePaymentInitiated(event);
            case "PaymentSucceeded":
                return this.handlePaymentSucceeded(event);
            case "PaymentFailed":
                return this.handlePaymentFailed(event);
            case "PaymentCashConfirmed":
                return this.handlePaymentCashConfirmed(event);
            case "RideCancelled":
                return this.handleRideCancelled(event);
            case "RideCancelledByDriver":
                return this.handleRideCancelledByDriver(event);
            case "RideFareUpdated":
                return this.handleRideFareUpdated(event);
            case "RideSearchProgressUpdated":
                return this.handleRideSearchProgressUpdated(event);
            case "FutureRideRequestSentToDriver":
                return this.handleFutureRideRequestSentToDriver(event);
            case "FutureRideAccepted":
                return this.handleFutureRideAccepted(event);
            case "FutureRideExpired":
                return this.handleFutureRideExpired(event);
            case "FutureRideCancelledByRider":
                return this.handleFutureRideCancelledByRider(event);
            case "FutureRideRequestExpiredForDriver":
                return this.handleFutureRideRequestExpiredForDriver(event);
            case "FutureRideRequestCancelledForDriver":
                return this.handleFutureRideRequestCancelledForDriver(event);
            case "RideRequestExpiredForDriver":
                return this.handleRideRequestExpiredForDriver(event);
            case "FutureRideLastRequestRejected":
                return this.handleFutureRideLastRequestRejected(event);
            default:
                Logger_1.Logger.warn("Unhandled domain event type", {
                    eventType: event.type,
                });
        }
    }
    async dispatchRegisteredHandlers(event) {
        const handlers = this.handlers.get(event.type);
        if (!handlers || handlers.size === 0) {
            return;
        }
        const results = await Promise.allSettled([...handlers].map((handler) => handler.handle(event)));
        results.forEach((result) => {
            if (result.status === "rejected") {
                Logger_1.Logger.error("Event handler failed", {
                    eventType: event.type,
                    error: result.reason instanceof Error
                        ? result.reason.message
                        : String(result.reason),
                });
            }
        });
    }
    async handleRideRequestCreated(event) {
        const { driverId, ...payload } = event.payload;
        await this.notificationService.notifyDriverNewRequest(driverId, payload);
        await this.persistence.persistNotification(driverId, {
            type: NotificationType_1.NotificationType.RIDE_REQUESTED,
            title: "New ride request!",
            body: "New ride request available",
            metadata: payload,
        });
    }
    async handleRideMatched(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyRiderRideMatched(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_ACCEPTED,
            title: "Your ride has been accepted!",
            body: "Your driver is on the way.",
            metadata: payload,
        });
    }
    async handleRideArrived(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyRiderRideArrived(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_ARRIVED,
            title: "Driver arrived",
            body: "Your driver is waiting.",
            metadata: payload,
        });
    }
    async handleRideStarted(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyRiderRideStarted(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_STARTED,
            title: "Ride started",
            body: "Enjoy your trip!",
            metadata: payload,
        });
    }
    async handleRideCompleted(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyRideCompleted(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_COMPLETED,
            title: "Ride completed",
            body: "Thank you for riding with us.",
            metadata: payload,
        });
        await this.incrementDriverRideCount(payload.driverId);
        await this.updateDriverAvailability(payload.driverId);
        await this.scheduleChatRoomEndForRide(payload.rideId);
    }
    async handlePaymentInitiated(event) {
        const { riderId } = event.payload;
        await this.paymentNotificationService.notifyPaymentInitiated(riderId, event.payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.PAYMENT_INITIATED,
            title: "Payment initiated",
            body: "Processing your payment...",
            metadata: { ...event.payload },
        });
    }
    async handlePaymentSucceeded(event) {
        const { riderId, driverId, driverUserId } = event.payload;
        await this.paymentNotificationService.notifyPaymentSucceeded(riderId, driverId, driverUserId, event.payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.PAYMENT_COMPLETED,
            title: "Payment successful",
            body: "Payment completed successfully.",
            metadata: { ...event.payload },
        });
        await this.persistence.persistNotification(driverUserId, {
            type: NotificationType_1.NotificationType.PAYMENT_COMPLETED,
            title: "Payment received",
            body: "You received a payment.",
            metadata: { ...event.payload },
        });
    }
    async handlePaymentFailed(event) {
        const { riderId, driverUserId } = event.payload;
        await this.paymentNotificationService.notifyPaymentFailed(riderId, driverUserId, event.payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.PAYMENT_FAILED,
            title: "Payment failed",
            body: "Payment failed. Please try again.",
            metadata: { ...event.payload },
        });
        await this.persistence.persistNotification(driverUserId, {
            type: NotificationType_1.NotificationType.PAYMENT_FAILED,
            title: "Payment failed",
            body: "Rider payment failed.",
            metadata: { ...event.payload },
        });
    }
    async handlePaymentCashConfirmed(event) {
        const { riderId, driverId, driverUserId } = event.payload;
        await this.paymentNotificationService.notifyPaymentCashConfirmed(driverId, event.payload);
        await this.persistence.persistNotification(driverUserId, {
            type: NotificationType_1.NotificationType.PAYMENT_COMPLETED,
            title: "Cash received",
            body: "You confirmed cash payment.",
            metadata: { ...event.payload },
        });
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.PAYMENT_COMPLETED,
            title: "Payment completed",
            body: "Cash payment confirmed.",
            metadata: { ...event.payload },
        });
    }
    async handleRideCancelled(event) {
        const { riderId, driverId, driverUserId } = event.payload;
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_CANCELLED,
            title: "Ride cancelled",
            body: "Your ride has been cancelled.",
            metadata: { ...event.payload },
        });
        if (driverId && driverUserId) {
            await this.persistence.persistNotification(driverUserId, {
                type: NotificationType_1.NotificationType.RIDE_CANCELLED,
                title: "Rider cancelled the ride",
                body: "The rider has cancelled the ride.",
                metadata: { ...event.payload },
            });
        }
        await this.updateDriverAvailability(driverId);
        await this.scheduleChatRoomEndAfterCancellation(event.payload.rideId);
    }
    async handleRideCancelledByDriver(event) {
        const { riderId, driverId } = event.payload;
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_CANCELLED_BY_DRIVER,
            title: "Driver cancelled the ride",
            body: "Your driver cancelled the ride.",
            metadata: { ...event.payload },
        });
        await this.updateDriverAvailability(driverId);
        await this.scheduleChatRoomEndAfterCancellation(event.payload.rideId);
    }
    async handleRideFareUpdated(event) {
        const { driverUserId, ...payload } = event.payload;
        await this.notificationService.notifyDriverFareUpdated(driverUserId, payload);
    }
    async handleRideSearchProgressUpdated(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyRiderSearchProgress(riderId, payload);
    }
    async updateDriverAvailability(driverId) {
        if (!driverId)
            return;
        try {
            const availability = await this.driverAvailabilityRepository.findActiveByDriverId(driverId);
            if (!availability)
                return;
            if (availability.getStatus() === AvailabilityStatus_1.AvailabilityStatus.SCHEDULED)
                return;
            availability.updateStatus(AvailabilityStatus_1.AvailabilityStatus.SCHEDULED);
            await this.driverAvailabilityRepository.save(availability);
        }
        catch (error) {
            Logger_1.Logger.error("Failed to update driver availability", {
                driverId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async incrementDriverRideCount(driverId) {
        try {
            const driver = await this.driverRepository.findById(driverId);
            if (!driver)
                return;
            driver.incrementTotalRides();
            await this.driverRepository.save(driver);
        }
        catch (error) {
            Logger_1.Logger.error("Failed to increment ride count", {
                driverId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async handleFutureRideRequestSentToDriver(event) {
        const { driverUserId, ...payload } = event.payload;
        await this.notificationService.notifyDriverNewFutureRequest(driverUserId, payload);
        await this.persistence.persistNotification(driverUserId, {
            type: NotificationType_1.NotificationType.RIDE_REQUESTED,
            title: "New scheduled ride request!",
            body: `New ride request for ${new Date(payload.pickupTime).toLocaleString()}`,
            metadata: payload,
        });
    }
    async handleFutureRideAccepted(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyFutureRideAccepted(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_ACCEPTED,
            title: "Scheduled ride confirmed",
            body: "A driver accepted your scheduled ride request.",
            metadata: payload,
        });
    }
    async handleFutureRideExpired(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyFutureRideExpired(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.NO_DRIVER_ACCEPTED,
            title: "Ride request expired",
            body: "Your future ride request expired because no driver accepted it in time.",
            metadata: payload,
        });
    }
    async handleFutureRideCancelledByRider(event) {
        const { riderId, ...payload } = event.payload;
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_CANCELLED,
            title: "Ride request cancelled",
            body: "Your ride request has been cancelled.",
            metadata: payload,
        });
    }
    async handleFutureRideRequestExpiredForDriver(event) {
        const { driverUserId, ...payload } = event.payload;
        await this.notificationService.notifyDriverFutureRideExpired(driverUserId, payload);
    }
    async handleFutureRideRequestCancelledForDriver(event) {
        const { driverUserId, ...payload } = event.payload;
        await this.notificationService.notifyDriverFutureRideRequestCancelled(driverUserId, payload);
    }
    async handleRideRequestExpiredForDriver(event) {
        const { driverUserId, ...payload } = event.payload;
        await this.notificationService.notifyDriverRideRequestExpired(driverUserId, payload);
    }
    async handleFutureRideLastRequestRejected(event) {
        const { riderId, ...payload } = event.payload;
        await this.notificationService.notifyRiderFutureRideAllDriversRejected(riderId, payload);
        await this.persistence.persistNotification(riderId, {
            type: NotificationType_1.NotificationType.RIDE_REQUEST_EXPIRED,
            title: "No drivers found",
            body: "No drivers accepted your scheduled ride request. Please try again.",
            metadata: { ...payload, riderId },
        });
    }
    async scheduleChatRoomEndForRide(rideId) {
        try {
            const chatRoom = await this.chatRoomRepository.findByRideId(rideId);
            if (!chatRoom) {
                Logger_1.Logger.warn("No chat room found for completed ride — skipping expiry schedule", {
                    rideId,
                });
                return;
            }
            await this.chatRoomExpiryService.scheduleChatRoomEnd(rideId, chatRoom.getId());
            Logger_1.Logger.info("Chat room end scheduled after ride completion", {
                rideId,
                chatRoomId: chatRoom.getId(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Failed to schedule chat room end after ride completion", {
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    async scheduleChatRoomEndAfterCancellation(rideId) {
        try {
            const chatRoom = await this.chatRoomRepository.findByRideId(rideId);
            if (!chatRoom) {
                Logger_1.Logger.info("No chat room found for cancelled ride — skipping expiry schedule", {
                    rideId,
                });
                return;
            }
            await this.chatRoomExpiryService.scheduleChatRoomEndAfterCancellation(rideId, chatRoom.getId());
            Logger_1.Logger.info("Chat room end scheduled after ride cancellation", {
                rideId,
                chatRoomId: chatRoom.getId(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Failed to schedule chat room end after ride cancellation", {
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
};
exports.InMemoryEventBus = InMemoryEventBus;
exports.InMemoryEventBus = InMemoryEventBus = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideNotificationService)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.NotificationPersistenceService)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.PaymentNotificationService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomExpiryService)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], InMemoryEventBus);
//# sourceMappingURL=InMemoryEventBus.js.map