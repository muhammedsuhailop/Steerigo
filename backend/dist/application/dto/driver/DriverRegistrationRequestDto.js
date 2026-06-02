"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRegistrationRequestDto = void 0;
class DriverRegistrationRequestDto {
    constructor(userId, name, mobile, dob, gender, state, pin, address, licenseCategory, licenseNumber, licenseBodyTypes, licenseGearTypes, licenseIssueDate, licenseExpiryDate, idType, idNumber, idIssueDate, idExpiryDate, licenseFrontImage, licenseBackImage, idFrontImage, idBackImage) {
        this.userId = userId;
        this.name = name;
        this.mobile = mobile;
        this.dob = dob;
        this.gender = gender;
        this.state = state;
        this.pin = pin;
        this.address = address;
        this.licenseCategory = licenseCategory;
        this.licenseNumber = licenseNumber;
        this.licenseBodyTypes = licenseBodyTypes;
        this.licenseGearTypes = licenseGearTypes;
        this.licenseIssueDate = licenseIssueDate;
        this.licenseExpiryDate = licenseExpiryDate;
        this.idType = idType;
        this.idNumber = idNumber;
        this.idIssueDate = idIssueDate;
        this.idExpiryDate = idExpiryDate;
        this.licenseFrontImage = licenseFrontImage;
        this.licenseBackImage = licenseBackImage;
        this.idFrontImage = idFrontImage;
        this.idBackImage = idBackImage;
    }
    static fromRequest(userId, body) {
        return new DriverRegistrationRequestDto(userId, body.name, body.mobile, new Date(body.dob), body.gender, body.state, body.pin, body.address, body.licenseCategory, body.licenseNumber, body.licenseBodyTypes, body.licenseGearTypes, new Date(body.licenseIssueDate), new Date(body.licenseExpiryDate), body.idType, body.idNumber, new Date(body.idIssueDate), body.idExpiryDate && body.idExpiryDate.trim() !== ""
            ? new Date(body.idExpiryDate)
            : null, body.licenseFrontImage, body.licenseBackImage, body.idFrontImage, body.idBackImage);
    }
    // User profile getters
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
    getState() {
        return this.state;
    }
    getPin() {
        return this.pin;
    }
    getAddress() {
        return this.address;
    }
    getFullAddress() {
        return `${this.address}, ${this.state}, ${this.pin}`;
    }
    // Driver license getters
    getLicenseCategory() {
        return this.licenseCategory;
    }
    getLicenseNumber() {
        return this.licenseNumber;
    }
    getEligibleBodyTypes() {
        return this.licenseBodyTypes;
    }
    getEligibleGearTypes() {
        return this.licenseGearTypes;
    }
    getLicenseIssueDate() {
        return this.licenseIssueDate;
    }
    getLicenseExpiryDate() {
        return this.licenseExpiryDate;
    }
    // ID doc getters
    getIdType() {
        return this.idType;
    }
    getIdNumber() {
        return this.idNumber;
    }
    getIdIssueDate() {
        return this.idIssueDate;
    }
    getIdExpiryDate() {
        return this.idExpiryDate;
    }
    // Image getters
    getLicenseFrontImage() {
        return this.licenseFrontImage;
    }
    getLicenseBackImage() {
        return this.licenseBackImage;
    }
    getIdFrontImage() {
        return this.idFrontImage;
    }
    getIdBackImage() {
        return this.idBackImage;
    }
    getLicenseImageUrls() {
        return {
            front: [this.licenseFrontImage],
            back: [this.licenseBackImage],
        };
    }
    getIdImageUrls() {
        return {
            front: [this.idFrontImage],
            back: [this.idBackImage],
        };
    }
}
exports.DriverRegistrationRequestDto = DriverRegistrationRequestDto;
//# sourceMappingURL=DriverRegistrationRequestDto.js.map