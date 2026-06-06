"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const DriverStatus_1 = require("../value-objects/DriverStatus");
const KYCStatus_1 = require("../value-objects/KYCStatus");
class Driver {
    constructor(id, userId, eligibleGearTypes, eligibleBodyTypes, licenseNumber, licenceCategory, licenseIssueDate, licenseExpiryDate, kycStatus, status, averageRating = 0, numberOfRatings = 0, totalRides = 0, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.userId = userId;
        this.eligibleGearTypes = eligibleGearTypes;
        this.eligibleBodyTypes = eligibleBodyTypes;
        this.licenseNumber = licenseNumber;
        this.licenceCategory = licenceCategory;
        this.licenseIssueDate = licenseIssueDate;
        this.licenseExpiryDate = licenseExpiryDate;
        this.kycStatus = kycStatus;
        this.status = status;
        this.averageRating = averageRating;
        this.numberOfRatings = numberOfRatings;
        this.totalRides = totalRides;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // Factory method for creating new drivers
    static create(id, userId, eligibleGearTypes, eligibleBodyTypes, licenseNumber, licenceCategory, licenseIssueDate, licenseExpiryDate) {
        return new Driver(id, userId, eligibleGearTypes, eligibleBodyTypes, licenseNumber, licenceCategory, licenseIssueDate, licenseExpiryDate, KYCStatus_1.KYCStatus.IN_REVIEW, DriverStatus_1.DriverStatus.ACTIVE, 0, 0, 0);
    }
    // Factory method for reconstructing from database
    static fromData(data) {
        return new Driver(data.id, data.userId, data.eligibleGearTypes, data.eligibleBodyTypes, data.licenseNumber, data.licenceCategory, data.licenseIssueDate, data.licenseExpiryDate, data.kycStatus, data.status, data.averageRating, data.numberOfRatings, data.totalRides, data.createdAt, data.updatedAt);
    }
    // Getters
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getEligibleGearTypes() {
        return [...this.eligibleGearTypes];
    }
    getEligibleBodyTypes() {
        return [...this.eligibleBodyTypes];
    }
    getLicenceCategory() {
        return this.licenceCategory;
    }
    getLicenseNumber() {
        return this.licenseNumber;
    }
    getLicenseIssueDate() {
        return this.licenseIssueDate;
    }
    getLicenseExpiryDate() {
        return this.licenseExpiryDate;
    }
    getKycStatus() {
        return this.kycStatus;
    }
    getStatus() {
        return this.status;
    }
    getisAvailable() {
        return this.status === DriverStatus_1.DriverStatus.ACTIVE;
    }
    getAverageRating() {
        return this.averageRating;
    }
    getNumberOfRatings() {
        return this.numberOfRatings;
    }
    getTotalRides() {
        return this.totalRides;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
    // Business methods
    block(_reason) {
        if (this.status === DriverStatus_1.DriverStatus.BLOCKED) {
            throw new Error("Driver is already blocked");
        }
        this.status = DriverStatus_1.DriverStatus.BLOCKED;
        this.updatedAt = new Date();
    }
    suspend(_reason) {
        if (this.status === DriverStatus_1.DriverStatus.SUSPENDED) {
            throw new Error("Driver is already suspended");
        }
        this.status = DriverStatus_1.DriverStatus.SUSPENDED;
        this.updatedAt = new Date();
    }
    activate() {
        if (this.status === DriverStatus_1.DriverStatus.ACTIVE) {
            throw new Error("Driver is already active");
        }
        this.status = DriverStatus_1.DriverStatus.ACTIVE;
        this.updatedAt = new Date();
    }
    updateKycStatus(newStatus) {
        this.kycStatus = newStatus;
        this.updatedAt = new Date();
    }
    updateEligibleVehicles(gearTypes, bodyTypes) {
        this.eligibleGearTypes = [...gearTypes];
        this.eligibleBodyTypes = [...bodyTypes];
        this.updatedAt = new Date();
    }
    updateLicenseInfo(category, issueDate, expiryDate) {
        this.licenceCategory = category;
        this.licenseIssueDate = issueDate;
        this.licenseExpiryDate = expiryDate;
        this.updatedAt = new Date();
    }
    isActive() {
        return this.status === DriverStatus_1.DriverStatus.ACTIVE;
    }
    isKycApproved() {
        return this.kycStatus === KYCStatus_1.KYCStatus.APPROVED;
    }
    canBeActioned() {
        return true;
    }
    updateRating(newRating) {
        if (newRating < 0 || newRating > 5) {
            throw new Error("Rating must be between 0 and 5");
        }
        const totalWeight = this.averageRating * this.numberOfRatings;
        this.numberOfRatings += 1;
        const newAverage = (totalWeight + newRating) / this.numberOfRatings;
        this.averageRating = Math.round(newAverage * 10) / 10;
        this.updatedAt = new Date();
    }
    incrementTotalRides() {
        this.totalRides += 1;
        this.updatedAt = new Date();
    }
}
exports.Driver = Driver;
//# sourceMappingURL=Driver.js.map