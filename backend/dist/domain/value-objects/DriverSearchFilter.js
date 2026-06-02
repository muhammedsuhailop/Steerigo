"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSearchFilter = void 0;
const DomainError_1 = require("../errors/DomainError");
class DriverSearchFilter {
    constructor(gearType, bodyType, minRating = 0) {
        this.gearType = gearType;
        this.bodyType = bodyType;
        this.minRating = minRating;
    }
    static create(gearType = "", bodyType = "", minRating = 0) {
        this.validateRating(minRating);
        return new DriverSearchFilter(gearType ? gearType : null, bodyType ? bodyType : null, minRating);
    }
    static empty() {
        return new DriverSearchFilter(null, null, 0);
    }
    static validateRating(rating) {
        if (typeof rating !== "number" || rating < 0 || rating > 5) {
            throw new DomainError_1.DomainError("Rating must be between 0 and 5");
        }
    }
    hasFilters() {
        return (this.gearType !== null || this.bodyType !== null || this.minRating > 0);
    }
    getGearType() {
        return this.gearType;
    }
    getBodyType() {
        return this.bodyType;
    }
    getMinRating() {
        return this.minRating;
    }
    matches(driverGearTypes, driverBodyTypes, driverRating) {
        // Check gear type
        if (this.gearType) {
            if (!driverGearTypes.includes(this.gearType)) {
                return false;
            }
        }
        // Check body type
        if (this.bodyType) {
            if (!driverBodyTypes.includes(this.bodyType)) {
                return false;
            }
        }
        // Check rating
        if (driverRating < this.minRating)
            return false;
        return true;
    }
}
exports.DriverSearchFilter = DriverSearchFilter;
//# sourceMappingURL=DriverSearchFilter.js.map