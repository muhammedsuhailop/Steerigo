"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindNearbyDriversRequestDto = void 0;
const ValidationErrors_1 = require("@domain/errors/ValidationErrors");
class FindNearbyDriversRequestDto {
    constructor(latitude, longitude, searchDate, timeRequired, radiusKm = 10, gearType = "", bodyType = "", limit = 20) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.searchDate = searchDate;
        this.timeRequired = timeRequired;
        this.radiusKm = radiusKm;
        this.gearType = gearType;
        this.bodyType = bodyType;
        this.limit = limit;
    }
    static fromRequest(requestBody) {
        const body = (requestBody ?? {});
        const { latitude, longitude, searchDate, timeRequired, radiusKm, gearType, bodyType, limit, } = body;
        let parsedSearchDate;
        if (typeof searchDate === "string") {
            parsedSearchDate = new Date(searchDate);
        }
        else {
            parsedSearchDate = new Date();
        }
        const radiusValue = radiusKm && radiusKm > 0 ? radiusKm : 10;
        const gearTypeValue = gearType ? gearType.trim() : "";
        const bodyTypeValue = bodyType ? bodyType.trim() : "";
        const limitValue = limit && limit > 0 ? limit : 20;
        return new FindNearbyDriversRequestDto(latitude, longitude, parsedSearchDate, timeRequired, radiusValue, gearTypeValue, bodyTypeValue, limitValue);
    }
    validate() {
        // Validate latitude
        if (typeof this.latitude !== "number" ||
            this.latitude < -90 ||
            this.latitude > 90) {
            throw new ValidationErrors_1.InvalidLatitudeError();
        }
        // Validate longitude
        if (typeof this.longitude !== "number" ||
            this.longitude < -180 ||
            this.longitude > 180) {
            throw new ValidationErrors_1.InvalidLongitudeError();
        }
        // Validate search date format
        if (!this.searchDate || !(this.searchDate instanceof Date)) {
            throw new ValidationErrors_1.InvalidSearchDateFormatError();
        }
        // Validate search date is in future (allow 5 minutes past for clock skew)
        if (this.searchDate < new Date(Date.now() - 5 * 60 * 1000)) {
            throw new ValidationErrors_1.InvalidSearchDateRangeError();
        }
        // Validate time required
        if (typeof this.timeRequired !== "number" ||
            this.timeRequired <= 0 ||
            this.timeRequired > 480) {
            throw new ValidationErrors_1.InvalidTimeRequiredError();
        }
        // Validate radius
        if (typeof this.radiusKm !== "number" ||
            this.radiusKm <= 0 ||
            this.radiusKm > 50) {
            throw new ValidationErrors_1.InvalidRadiusError();
        }
        // Validate limit
        if (typeof this.limit !== "number" || this.limit <= 0 || this.limit > 100) {
            throw new ValidationErrors_1.InvalidLimitError();
        }
        // Validate gear type
        if (this.gearType && this.gearType.trim()) {
            const validGearTypes = ["Manual", "Automatic"];
            if (!validGearTypes.includes(this.gearType)) {
                throw new ValidationErrors_1.InvalidGearTypeError(`Invalid gear type: ${this.gearType}. Valid options: ${validGearTypes.join(", ")}`);
            }
        }
        // Validate body type
        if (this.bodyType && this.bodyType.trim()) {
            const validBodyTypes = ["Sedan", "SUV", "Hatchback"];
            if (!validBodyTypes.includes(this.bodyType)) {
                throw new ValidationErrors_1.InvalidBodyTypeError(`Invalid body type: ${this.bodyType}. Valid options: ${validBodyTypes.join(", ")}`);
            }
        }
    }
    getSearchWindow() {
        const startTime = new Date(this.searchDate);
        // Driver should be available from now until searchDate + timeRequired
        startTime.setMinutes(startTime.getMinutes() - 10); // 10 minute buffer before
        const endTime = new Date(this.searchDate);
        endTime.setMinutes(endTime.getMinutes() + this.timeRequired + 10); // 10 minute buffer after
        return { startTime, endTime };
    }
    getTotalDurationMinutes() {
        return this.timeRequired;
    }
}
exports.FindNearbyDriversRequestDto = FindNearbyDriversRequestDto;
//# sourceMappingURL=FindNearbyDriversRequestDto.js.map