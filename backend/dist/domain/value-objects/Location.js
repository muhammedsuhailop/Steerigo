"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const DomainError_1 = require("../errors/DomainError");
class Location {
    constructor(latitude, longitude, address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }
    static create(coordinates) {
        this.validateCoordinates(coordinates.latitude, coordinates.longitude);
        return new Location(coordinates.latitude, coordinates.longitude, coordinates.address?.trim());
    }
    static createDummy() {
        // Default location - can be updated later
        return new Location(12.9716, 77.5946, "Bangalore, Karnataka, India");
    }
    static validateCoordinates(latitude, longitude) {
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            throw new DomainError_1.DomainError("Latitude and longitude must be numbers");
        }
        if (latitude < -90 || latitude > 90) {
            throw new DomainError_1.DomainError("Latitude must be between -90 and 90 degrees");
        }
        if (longitude < -180 || longitude > 180) {
            throw new DomainError_1.DomainError("Longitude must be between -180 and 180 degrees");
        }
    }
    getLatitude() {
        return this.latitude;
    }
    getLongitude() {
        return this.longitude;
    }
    getAddress() {
        return this.address;
    }
    getCoordinates() {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address,
        };
    }
    equals(other) {
        return (this.latitude === other.latitude &&
            this.longitude === other.longitude &&
            this.address === other.address);
    }
    distanceTo(other) {
        const R = 6371; // Earth radius in km
        const dLat = this.toRad(other.latitude - this.latitude);
        const dLon = this.toRad(other.longitude - this.longitude);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(this.toRad(this.latitude)) *
                Math.cos(this.toRad(other.latitude)) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    toRad(value) {
        return (value * Math.PI) / 180;
    }
    toString() {
        return `Location(${this.latitude}, ${this.longitude}${this.address ? `, ${this.address}` : ""})`;
    }
}
exports.Location = Location;
//# sourceMappingURL=Location.js.map