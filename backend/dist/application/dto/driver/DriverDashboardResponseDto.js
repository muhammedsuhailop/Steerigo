"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverDashboardResponseDto = void 0;
class DriverDashboardResponseDto {
    constructor(driver, availability, currentRide, pendingRequests, statistics, performance, meta) {
        this.driver = driver;
        this.availability = availability;
        this.currentRide = currentRide;
        this.pendingRequests = pendingRequests;
        this.statistics = statistics;
        this.performance = performance;
        this.meta = meta;
    }
    static create(data) {
        return Object.assign(new DriverDashboardResponseDto(data.driver, data.availability, data.currentRide, data.pendingRequests, data.statistics, data.performance, data.meta));
    }
}
exports.DriverDashboardResponseDto = DriverDashboardResponseDto;
//# sourceMappingURL=DriverDashboardResponseDto.js.map