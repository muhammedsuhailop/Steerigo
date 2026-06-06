"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRIVER_STATUS_TRANSITIONS = exports.VALID_DRIVER_STATUSES = exports.DriverStatus = void 0;
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["ACTIVE"] = "Active";
    DriverStatus["BLOCKED"] = "Blocked";
    DriverStatus["SUSPENDED"] = "Suspended";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
exports.VALID_DRIVER_STATUSES = Object.values(DriverStatus);
exports.DRIVER_STATUS_TRANSITIONS = {
    [DriverStatus.ACTIVE]: [DriverStatus.BLOCKED, DriverStatus.SUSPENDED],
    [DriverStatus.BLOCKED]: [DriverStatus.ACTIVE],
    [DriverStatus.SUSPENDED]: [DriverStatus.ACTIVE, DriverStatus.BLOCKED],
};
//# sourceMappingURL=DriverStatus.js.map