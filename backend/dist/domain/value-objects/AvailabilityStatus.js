"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABILITY_STATUS_TRANSITIONS = exports.VALID_AVAILABILITY_STATUSES = exports.AvailabilityStatus = void 0;
var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["AVAILABLE"] = "Available";
    AvailabilityStatus["BUSY"] = "Busy";
    AvailabilityStatus["OFFLINE"] = "Offline";
    AvailabilityStatus["SCHEDULED"] = "Scheduled";
})(AvailabilityStatus || (exports.AvailabilityStatus = AvailabilityStatus = {}));
exports.VALID_AVAILABILITY_STATUSES = Object.values(AvailabilityStatus);
exports.AVAILABILITY_STATUS_TRANSITIONS = {
    [AvailabilityStatus.OFFLINE]: [
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.SCHEDULED,
    ],
    [AvailabilityStatus.AVAILABLE]: [
        AvailabilityStatus.BUSY,
        AvailabilityStatus.OFFLINE,
    ],
    [AvailabilityStatus.BUSY]: [
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.OFFLINE,
    ],
    [AvailabilityStatus.SCHEDULED]: [
        AvailabilityStatus.AVAILABLE,
        AvailabilityStatus.BUSY,
        AvailabilityStatus.OFFLINE,
    ],
};
//# sourceMappingURL=AvailabilityStatus.js.map