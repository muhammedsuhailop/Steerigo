"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfilePictureDto = void 0;
const FilePurpose_1 = require("@domain/value-objects/FilePurpose");
class UpdateProfilePictureDto {
    constructor(data) {
        this.purpose = FilePurpose_1.FilePurpose.create("profile");
        this.userId = data.userId;
        this.file = data.file;
    }
    static fromRequest(userId, file) {
        return new UpdateProfilePictureDto({ userId, file });
    }
    validate() {
        const errors = [];
        if (!this.userId || this.userId.trim().length === 0) {
            errors.push("User ID is required");
        }
        if (!this.file) {
            errors.push("File is required");
        }
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (this.file && this.file.size > maxSize) {
            errors.push("File size cannot exceed 2MB");
        }
        // Only allow image types for profile picture
        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (this.file && !allowedMimeTypes.includes(this.file.mimetype)) {
            errors.push(`Invalid file type for profile picture. Allowed types: ${allowedMimeTypes.join(", ")}`);
        }
        return errors;
    }
    getFileSizeInMB() {
        return parseFloat((this.file.size / (1024 * 1024)).toFixed(2));
    }
}
exports.UpdateProfilePictureDto = UpdateProfilePictureDto;
//# sourceMappingURL=UpdateProfilePictureDto.js.map