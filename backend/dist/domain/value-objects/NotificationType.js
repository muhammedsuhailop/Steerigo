"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    // Ride
    NotificationType["RIDE_REQUESTED"] = "RIDE REQUESTED";
    NotificationType["RIDE_ACCEPTED"] = "RIDE ACCEPTED";
    NotificationType["RIDE_ARRIVED"] = "RIDE ARRIVED";
    NotificationType["RIDE_REJECTED"] = "RIDE REJECTED";
    NotificationType["RIDE_STARTED"] = "RIDE STARTED";
    NotificationType["RIDE_COMPLETED"] = "RIDE COMPLETED";
    NotificationType["RIDE_CANCELLED"] = "RIDE CANCELLED";
    NotificationType["RIDE_NO_DRIVER_FOUND"] = "NO_DRIVER FOUND";
    NotificationType["RIDE_CANCELLED_BY_DRIVER"] = "RIDE CANCELLED BY DRIVER";
    NotificationType["NO_DRIVER_ACCEPTED"] = "NO_DRIVER_ACCDPTED";
    NotificationType["RIDE_REQUEST_EXPIRED"] = "RIDE REQUEST EXPIRED";
    // Payment
    NotificationType["PAYMENT_INITIATED"] = "PAYMENT INITIATED";
    NotificationType["PAYMENT_COMPLETED"] = "PAYMENT COMPLETED";
    NotificationType["PAYMENT_FAILED"] = "PAYMENT FAILED";
    // Promotions
    NotificationType["PROMO_OFFER"] = "PROMO OFFER";
    NotificationType["SYSTEM_ANNOUNCEMENT"] = "SYSTEM ANNOUNCEMENT";
    NotificationType["NEW_MESSAGE"] = "NEW MESSAGE";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=NotificationType.js.map