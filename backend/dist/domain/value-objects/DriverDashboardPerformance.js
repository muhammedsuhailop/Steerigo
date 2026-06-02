"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverDashboardPerformance = void 0;
class DriverDashboardPerformance {
    constructor(acceptanceRate, cancellationRate, averageRating) {
        this.acceptanceRate = acceptanceRate;
        this.cancellationRate = cancellationRate;
        this.averageRating = averageRating;
    }
    static create(acceptanceRate, cancellationRate, averageRating) {
        if (acceptanceRate < 0 || acceptanceRate > 100) {
            throw new Error("Acceptance rate must be between 0 and 100");
        }
        if (cancellationRate < 0 || cancellationRate > 100) {
            throw new Error("Cancellation rate must be between 0 and 100");
        }
        if (averageRating < 0 || averageRating > 5) {
            throw new Error("Average rating must be between 0 and 5");
        }
        return new DriverDashboardPerformance(acceptanceRate, cancellationRate, averageRating);
    }
    getAcceptanceRate() {
        return this.acceptanceRate;
    }
    getCancellationRate() {
        return this.cancellationRate;
    }
    getAverageRating() {
        return this.averageRating;
    }
}
exports.DriverDashboardPerformance = DriverDashboardPerformance;
//# sourceMappingURL=DriverDashboardPerformance.js.map