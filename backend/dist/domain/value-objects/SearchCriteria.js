"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchCriteria = void 0;
const DomainError_1 = require("../errors/DomainError");
class SearchCriteria {
    constructor(location, searchDate, radiusKm, timeRequiredMinutes // NEW
    ) {
        this.location = location;
        this.searchDate = searchDate;
        this.radiusKm = radiusKm;
        this.timeRequiredMinutes = timeRequiredMinutes;
    }
    static create(location, searchDate, radiusKm = 10, timeRequiredMinutes = 60 // NEW
    ) {
        this.validateLocation(location);
        this.validateSearchDate(searchDate);
        this.validateRadius(radiusKm);
        this.validateTimeRequired(timeRequiredMinutes); // NEW
        return new SearchCriteria(location, searchDate, radiusKm, timeRequiredMinutes);
    }
    static validateLocation(location) {
        if (!location || typeof location !== "object") {
            throw new DomainError_1.DomainError("Invalid location object");
        }
        if (typeof location.latitude !== "number" ||
            location.latitude < -90 ||
            location.latitude > 90) {
            throw new DomainError_1.DomainError("Invalid latitude: must be between -90 and 90");
        }
        if (typeof location.longitude !== "number" ||
            location.longitude < -180 ||
            location.longitude > 180) {
            throw new DomainError_1.DomainError("Invalid longitude: must be between -180 and 180");
        }
    }
    static validateSearchDate(searchDate) {
        if (!(searchDate instanceof Date)) {
            throw new DomainError_1.DomainError("Search date must be a valid Date object");
        }
        // Allow searches for current and future times
        const now = new Date();
        if (searchDate < new Date(now.getTime() - 5 * 60 * 1000)) {
            throw new DomainError_1.DomainError("Search date cannot be in the past");
        }
    }
    static validateRadius(radiusKm) {
        if (typeof radiusKm !== "number" || radiusKm <= 0 || radiusKm > 50) {
            throw new DomainError_1.DomainError("Radius must be between 0 and 50 km");
        }
    }
    // NEW: Validate time required
    static validateTimeRequired(timeRequiredMinutes) {
        if (typeof timeRequiredMinutes !== "number" ||
            timeRequiredMinutes <= 0 ||
            timeRequiredMinutes > 240) {
            throw new DomainError_1.DomainError("Time required must be between 1 and 240 minutes");
        }
    }
    getLocation() {
        return { ...this.location };
    }
    getLatitude() {
        return this.location.latitude;
    }
    getLongitude() {
        return this.location.longitude;
    }
    getSearchDate() {
        return new Date(this.searchDate);
    }
    getRadiusKm() {
        return this.radiusKm;
    }
    // NEW: Get time required
    getTimeRequiredMinutes() {
        return this.timeRequiredMinutes;
    }
    // UPDATED: Calculate search window based on timeRequired
    getSearchWindow() {
        const startTime = new Date(this.searchDate);
        startTime.setMinutes(startTime.getMinutes() - 10); // 10 minute buffer before
        const endTime = new Date(this.searchDate);
        endTime.setMinutes(endTime.getMinutes() + this.timeRequiredMinutes + 10); // Add buffer
        return { startTime, endTime };
    }
}
exports.SearchCriteria = SearchCriteria;
//# sourceMappingURL=SearchCriteria.js.map