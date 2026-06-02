"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const inversify_1 = require("inversify");
const cloudinary_1 = require("cloudinary");
const Logger_1 = require("@shared/utils/Logger");
const streamifier_1 = __importDefault(require("streamifier"));
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async upload(fileBuffer, userId, purpose, originalName) {
        try {
            const timestamp = Date.now();
            const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
            const publicId = `${userId}_${timestamp}_${sanitizedOriginalName}`;
            Logger_1.Logger.info("Starting Cloudinary upload", {
                userId,
                purpose,
                originalName,
                publicId,
                fileSize: fileBuffer.length,
            });
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: `steerigo/${purpose}`,
                    public_id: publicId,
                    resource_type: "auto",
                    transformation: [
                        { quality: "auto:good" },
                        { fetch_format: "auto" },
                    ],
                }, (error, result) => {
                    if (error) {
                        Logger_1.Logger.error("Cloudinary upload failed", {
                            userId,
                            purpose,
                            error: error.message,
                        });
                        reject(new Error(`Cloudinary upload failed: ${error.message}`));
                    }
                    else {
                        Logger_1.Logger.info("Cloudinary upload successful", {
                            userId,
                            purpose,
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            filename: sanitizedOriginalName,
                            size: result.bytes || fileBuffer.length,
                        });
                    }
                });
                streamifier_1.default.createReadStream(fileBuffer).pipe(uploadStream);
            });
        }
        catch (error) {
            Logger_1.Logger.error("File upload service error", {
                userId,
                purpose,
                error: error.message,
            });
            throw new Error(`File upload service error: ${error.message}`);
        }
    }
    async delete(publicId) {
        try {
            if (!publicId || publicId.trim() === "") {
                throw new Error("Public ID is required for deletion");
            }
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return { result: result.result };
        }
        catch (error) {
            Logger_1.Logger.error("File deletion failed", {
                publicId,
                error: error.message,
                stack: error.stack,
            });
            throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
        }
    }
    async generateSignedUrl(publicId, expiresIn = 3600) {
        try {
            const timestamp = Math.round(new Date().getTime() / 1000) + expiresIn;
            const signedUrl = cloudinary_1.v2.utils.private_download_url(publicId, "jpg", {
                expires_at: timestamp,
            });
            Logger_1.Logger.info("Generated signed URL", { publicId, expiresIn });
            return signedUrl;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to generate signed URL", {
                publicId,
                error: error.message,
            });
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }
    async validateFile(file, purpose) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return false;
        }
        const allowedTypes = this.getAllowedMimeTypes(purpose);
        return allowedTypes.includes(file.mimetype);
    }
    getAllowedMimeTypes(purpose) {
        const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const documentTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];
        switch (purpose) {
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
                return [...imageTypes, ...documentTypes];
            default:
                return imageTypes;
        }
    }
    async listByPrefix(prefix) {
        const response = await cloudinary_1.v2.api.resources({
            type: "upload",
            prefix,
            max_results: 100,
        });
        return response.resources.map((r) => ({
            public_id: r.public_id,
            secure_url: r.secure_url,
            format: r.format,
            bytes: r.bytes,
            created_at: r.created_at,
        }));
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=CloudinaryService.js.map