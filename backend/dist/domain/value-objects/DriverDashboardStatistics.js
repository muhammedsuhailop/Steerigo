"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverDashboardStatistics = void 0;
class DriverDashboardStatistics {
    constructor(ridesCompleted, ridesCancelled, totalEarnings) {
        this.ridesCompleted = ridesCompleted;
        this.ridesCancelled = ridesCancelled;
        this.totalEarnings = totalEarnings;
    }
    static create(ridesCompleted, ridesCancelled, totalEarnings) {
        if (ridesCompleted < 0 || ridesCancelled < 0 || totalEarnings < 0) {
            throw new Error("Statistics values cannot be negative");
        }
        return new DriverDashboardStatistics(ridesCompleted, ridesCancelled, totalEarnings);
    }
    getRidesCompleted() {
        return this.ridesCompleted;
    }
    getRidesCancelled() {
        return this.ridesCancelled;
    }
    getTotalEarnings() {
        return this.totalEarnings;
    }
}
exports.DriverDashboardStatistics = DriverDashboardStatistics;
//# sourceMappingURL=DriverDashboardStatistics.js.map