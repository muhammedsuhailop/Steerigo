"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
class File {
    constructor(id, userId, filename, originalName, mimeType, size, url, publicId, purpose, uploadedAt, isActive = true) {
        this.id = id;
        this.userId = userId;
        this.filename = filename;
        this.originalName = originalName;
        this.mimeType = mimeType;
        this.size = size;
        this.url = url;
        this.publicId = publicId;
        this.purpose = purpose;
        this.uploadedAt = uploadedAt;
        this.isActive = isActive;
    }
    static create(data) {
        return new File(data.id, data.userId, data.filename, data.originalName, data.mimeType, data.size, data.url, data.publicId, data.purpose, data.uploadedAt || new Date());
    }
    isImage() {
        return this.mimeType.startsWith("image/");
    }
    isDocument() {
        return [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(this.mimeType);
    }
    getFileExtension() {
        return this.originalName.split(".").pop()?.toLowerCase() || "";
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map