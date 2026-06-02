"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadDto = void 0;
const FilePurpose_1 = require("../../../domain/value-objects/FilePurpose");
class FileUploadDto {
    constructor(data) {
        this.userId = data.userId;
        this.purpose = FilePurpose_1.FilePurpose.create(data.purpose);
        this.file = data.file;
    }
    validate() {
        const errors = [];
        // Purpose validation is handled by FilePurpose value object
        if (!this.file) {
            errors.push("File is required");
            return errors;
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (this.file.size > maxSize) {
            errors.push("File size cannot exceed 2MB");
        }
        // MIME type validation based on purpose
        const allowedMimeTypes = this.getAllowedMimeTypesForPurpose();
        if (!allowedMimeTypes.includes(this.file.mimetype)) {
            errors.push(`Invalid file type for purpose ${this.purpose.toString()}. Allowed types: ${allowedMimeTypes.join(", ")}`);
        }
        return errors;
    }
    getUserId() {
        return this.userId;
    }
    getAllowedMimeTypesForPurpose() {
        const purposeValue = this.purpose.getValue();
        const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const documentTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];
        switch (purposeValue) {
            case "avatar":
            case "profile":
                return imageTypes;
            case "licenseFront":
            case "licenseBack":
            case "kycdocFront":
            case "kycdocBack":
            case "insurance":
                return documentTypes;
            case "document":
                return [
                    ...imageTypes,
                    ...documentTypes,
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ];
            default:
                return imageTypes;
        }
    }
    getFileSizeInMB() {
        return parseFloat((this.file.size / (1024 * 1024)).toFixed(2));
    }
}
exports.FileUploadDto = FileUploadDto;
//# sourceMappingURL=FileUploadDto.js.map