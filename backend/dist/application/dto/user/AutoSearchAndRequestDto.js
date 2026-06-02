"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSearchAndRequestDto = void 0;
const ValidationErrors_1 = require("@domain/errors/ValidationErrors");
class AutoSearchAndRequestDto {
    constructor(requestGroupId, riderId, latitude, longitude, searchDate, timeRequired, radiusKm = 10, gearType = "", bodyType = "", maxRideRequests = 5, dropLatitude, dropLongitude, dropAddress, pickupAddress, rideType) {
        this.requestGroupId = requestGroupId;
        this.riderId = riderId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.searchDate = searchDate;
        this.timeRequired = timeRequired;
        this.radiusKm = radiusKm;
        this.gearType = gearType;
        this.bodyType = bodyType;
        this.maxRideRequests = maxRideRequests;
        this.dropLatitude = dropLatitude;
        this.dropLongitude = dropLongitude;
        this.dropAddress = dropAddress;
        this.pickupAddress = pickupAddress;
        this.rideType = rideType;
    }
    static fromRequest(riderId, requestBody) {
        const body = (requestBody ?? {});
        const { requestGroupId, latitude, longitude, searchDate, timeRequired, radiusKm, gearType, bodyType, maxRideRequests, dropLatitude, dropLongitude, dropAddress, pickupAddress, rideType, } = body;
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
        const maxRequestsValue = maxRideRequests && maxRideRequests > 0 ? maxRideRequests : 5;
        return new AutoSearchAndRequestDto(requestGroupId, riderId, latitude, longitude, parsedSearchDate, timeRequired, radiusValue, gearTypeValue, bodyTypeValue, maxRequestsValue, dropLatitude, dropLongitude, dropAddress, pickupAddress, rideType);
    }
    getRiderId() {
        return this.riderId;
    }
    validate() {
        if (typeof this.latitude !== "number" ||
            this.latitude < -90 ||
            this.latitude > 90) {
            throw new ValidationErrors_1.InvalidLatitudeError();
        }
        if (typeof this.longitude !== "number" ||
            this.longitude < -180 ||
            this.longitude > 180) {
            throw new ValidationErrors_1.InvalidLongitudeError();
        }
        if (!this.requestGroupId) {
            throw new Error("RequestGroupId required");
        }
        if (!this.searchDate || !(this.searchDate instanceof Date)) {
            throw new ValidationErrors_1.InvalidSearchDateFormatError();
        }
        if (this.searchDate < new Date(Date.now() - 5 * 60 * 1000)) {
            throw new ValidationErrors_1.InvalidSearchDateRangeError();
        }
        if (typeof this.timeRequired !== "number" ||
            this.timeRequired <= 0 ||
            this.timeRequired > 480) {
            throw new ValidationErrors_1.InvalidTimeRequiredError();
        }
        if (typeof this.radiusKm !== "number" ||
            this.radiusKm <= 0 ||
            this.radiusKm > 50) {
            throw new ValidationErrors_1.InvalidRadiusError();
        }
        if (typeof this.maxRideRequests !== "number" ||
            this.maxRideRequests <= 0 ||
            this.maxRideRequests > 20) {
            throw new Error("InvalidPreferredCountError");
        }
        if (typeof this.dropLatitude !== "number" ||
            this.dropLatitude < -90 ||
            this.dropLatitude > 90) {
            throw new ValidationErrors_1.InvalidLatitudeError();
        }
        if (typeof this.dropLongitude !== "number" ||
            this.dropLongitude < -180 ||
            this.dropLongitude > 180) {
            throw new ValidationErrors_1.InvalidLongitudeError();
        }
        if (this.gearType && this.gearType.trim()) {
            const validGearTypes = ["Manual", "Automatic"];
            if (!validGearTypes.includes(this.gearType)) {
                throw new ValidationErrors_1.InvalidGearTypeError(`Invalid gear type: ${this.gearType}. Valid options: ${validGearTypes.join(", ")}`);
            }
        }
        if (this.bodyType && this.bodyType.trim()) {
            const validBodyTypes = ["Sedan", "SUV", "Hatchback"];
            if (!validBodyTypes.includes(this.bodyType)) {
                throw new ValidationErrors_1.InvalidBodyTypeError(`Invalid body type: ${this.bodyType}. Valid options: ${validBodyTypes.join(", ")}`);
            }
        }
        if (!["One Way", "Round Trip"].includes(this.rideType)) {
            throw new Error("Invalid ride type. Must be 'One Way' or 'Round Trip'");
        }
    }
    getSearchWindow() {
        const startTime = new Date(this.searchDate);
        startTime.setMinutes(startTime.getMinutes() - 10);
        const endTime = new Date(this.searchDate);
        endTime.setMinutes(endTime.getMinutes() + this.timeRequired + 10);
        return { startTime, endTime };
    }
    getTotalDurationMinutes() {
        return this.timeRequired;
    }
}
exports.AutoSearchAndRequestDto = AutoSearchAndRequestDto;
//# sourceMappingURL=AutoSearchAndRequestDto.js.map