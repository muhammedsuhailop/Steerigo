"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCSubmissionRequestDto = void 0;
class KYCSubmissionRequestDto {
    constructor(userId, licenseCategory, licenseNumber, licenseBodyTypes, licenseGearTypes, licenseIssueDate, licenseExpiryDate, licenseFrontImage, licenseBackImage, idType, idNumber, idIssueDate, idExpiryDate, idFrontImage, idBackImage) {
        this.userId = userId;
        this.licenseCategory = licenseCategory;
        this.licenseNumber = licenseNumber;
        this.licenseBodyTypes = licenseBodyTypes;
        this.licenseGearTypes = licenseGearTypes;
        this.licenseIssueDate = licenseIssueDate;
        this.licenseExpiryDate = licenseExpiryDate;
        this.licenseFrontImage = licenseFrontImage;
        this.licenseBackImage = licenseBackImage;
        this.idType = idType;
        this.idNumber = idNumber;
        this.idIssueDate = idIssueDate;
        this.idExpiryDate = idExpiryDate;
        this.idFrontImage = idFrontImage;
        this.idBackImage = idBackImage;
    }
    static fromLicenseRequest(userId, body) {
        return new KYCSubmissionRequestDto(userId, body.licenseCategory, body.docNumber, body.eligibleBodyTypes, body.eligibleGearTypes, body.issueDate ? new Date(body.issueDate) : undefined, body.expiryDate ? new Date(body.expiryDate) : undefined, body.frontImageUrls?.[0], body.backImageUrls?.[0], undefined, // idType
        undefined, // idNumber
        undefined, // idIssueDate
        undefined, // idExpiryDate
        undefined, // idFrontImage
        undefined // idBackImage
        );
    }
    static fromGenericRequest(userId, docType, body) {
        return new KYCSubmissionRequestDto(userId, undefined, // licenseCategory
        undefined, // licenseNumber
        undefined, // licenseBodyTypes
        undefined, // licenseGearTypes
        undefined, // licenseIssueDate
        undefined, // licenseExpiryDate
        undefined, // licenseFrontImage
        undefined, // licenseBackImage
        docType, body.docNumber, body.issueDate ? new Date(body.issueDate) : undefined, body.expiryDate ? new Date(body.expiryDate) : undefined, body.frontImageUrls?.[0], body.backImageUrls?.[0]);
    }
    validate() {
        const errors = [];
        const hasLicense = this.licenseNumber ||
            this.licenseFrontImage ||
            this.licenseBackImage ||
            this.licenseCategory;
        const hasId = this.idNumber || this.idFrontImage || this.idBackImage || this.idType;
        if (!hasLicense && !hasId) {
            errors.push("At least one document (License or ID) must be provided");
        }
        if (this.licenseNumber ||
            this.licenseCategory ||
            this.licenseIssueDate ||
            this.licenseExpiryDate) {
            if (!this.licenseNumber)
                errors.push("License number is required");
            if (!this.licenseCategory)
                errors.push("License category is required");
            if (!this.licenseIssueDate)
                errors.push("License issue date is required");
            if (!this.licenseExpiryDate)
                errors.push("License expiry date is required");
            if (this.licenseBodyTypes && this.licenseBodyTypes.length === 0) {
                errors.push("Eligible body types are required for license");
            }
            if (this.licenseGearTypes && this.licenseGearTypes.length === 0) {
                errors.push("Eligible gear types are required for license");
            }
        }
        if (this.idNumber || this.idType || this.idIssueDate || this.idExpiryDate) {
            if (!this.idNumber)
                errors.push("ID number is required");
            if (!this.idType)
                errors.push("ID type is required");
            if (!this.idIssueDate)
                errors.push("ID issue date is required");
        }
        return errors;
    }
    getUserId() {
        return this.userId;
    }
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
    getLicenseFrontImage() {
        return this.licenseFrontImage;
    }
    getLicenseBackImage() {
        return this.licenseBackImage;
    }
    getLicenseImageUrls() {
        if (!this.licenseFrontImage && !this.licenseBackImage) {
            return null;
        }
        return {
            front: this.licenseFrontImage ? [this.licenseFrontImage] : [],
            back: this.licenseBackImage ? [this.licenseBackImage] : [],
        };
    }
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
    getIdFrontImage() {
        return this.idFrontImage;
    }
    getIdBackImage() {
        return this.idBackImage;
    }
    getIdImageUrls() {
        if (!this.idFrontImage && !this.idBackImage) {
            return null;
        }
        return {
            front: this.idFrontImage ? [this.idFrontImage] : [],
            back: this.idBackImage ? [this.idBackImage] : [],
        };
    }
    hasLicenseUpdate() {
        return !!(this.licenseNumber ||
            this.licenseCategory ||
            this.licenseIssueDate ||
            this.licenseExpiryDate);
    }
    hasIdUpdate() {
        return !!(this.idNumber || this.idType || this.idIssueDate);
    }
    hasImages() {
        return !!(this.licenseFrontImage ||
            this.licenseBackImage ||
            this.idFrontImage ||
            this.idBackImage);
    }
}
exports.KYCSubmissionRequestDto = KYCSubmissionRequestDto;
//# sourceMappingURL=KYCSubmissionRequestDto.js.map