"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverProfileUpdateDto = void 0;
class DriverProfileUpdateDto {
    constructor(userId, name, mobile, dob, gender, address, eligibleGearTypes, eligibleBodyTypes) {
        this.userId = userId;
        this.name = name;
        this.mobile = mobile;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.eligibleGearTypes = eligibleGearTypes;
        this.eligibleBodyTypes = eligibleBodyTypes;
    }
    static fromRequest(userId, body) {
        return new DriverProfileUpdateDto(userId, body.name, body.mobile, body.dob ? new Date(body.dob) : undefined, body.gender, body.address, body.eligibleGearTypes, body.eligibleBodyTypes);
    }
    getUserId() {
        return this.userId;
    }
    getName() {
        return this.name;
    }
    getMobile() {
        return this.mobile;
    }
    getDob() {
        return this.dob;
    }
    getGender() {
        return this.gender;
    }
    getAddress() {
        return this.address;
    }
    getEligibleGearTypes() {
        return this.eligibleGearTypes;
    }
    getEligibleBodyTypes() {
        return this.eligibleBodyTypes;
    }
    hasUserProfileUpdates() {
        return !!(this.name ||
            this.mobile ||
            this.dob ||
            this.gender ||
            this.address);
    }
    hasVehicleTypeUpdates() {
        return !!(this.eligibleGearTypes || this.eligibleBodyTypes);
    }
    getUserProfileUpdates() {
        const updates = {};
        if (this.name)
            updates.name = this.name;
        if (this.mobile)
            updates.mobile = this.mobile;
        if (this.dob)
            updates.dob = this.dob;
        if (this.gender)
            updates.gender = this.gender;
        if (this.address)
            updates.address = this.address;
        return updates;
    }
    validate() {
        const errors = [];
        if ((this.eligibleGearTypes && !this.eligibleBodyTypes) ||
            (!this.eligibleGearTypes && this.eligibleBodyTypes)) {
            errors.push("Both eligibleGearTypes and eligibleBodyTypes must be provided together");
        }
        if (this.eligibleGearTypes && this.eligibleGearTypes.length === 0) {
            errors.push("eligibleGearTypes array cannot be empty");
        }
        if (this.eligibleBodyTypes && this.eligibleBodyTypes.length === 0) {
            errors.push("eligibleBodyTypes array cannot be empty");
        }
        return errors;
    }
}
exports.DriverProfileUpdateDto = DriverProfileUpdateDto;
//# sourceMappingURL=DriverProfileUpdateDto.js.map