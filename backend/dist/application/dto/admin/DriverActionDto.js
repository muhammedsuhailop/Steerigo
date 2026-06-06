"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverActionDto = void 0;
class DriverActionDto {
    constructor(data) {
        this.driverId = data.driverId;
        this.action = data.action;
        this.reason = data.reason;
    }
    getStatusFromAction() {
        switch (this.action) {
            case "block":
                return "Blocked";
            case "unblock":
                return "Active";
            case "inreview":
                return "InReview";
            default:
                throw new Error(`Invalid action: ${this.action}`);
        }
    }
}
exports.DriverActionDto = DriverActionDto;
//# sourceMappingURL=DriverActionDto.js.map