import { injectable } from "inversify";
import { v2 as cloudinary } from "cloudinary";
import {
  FileUploadService,
  FileUploadResult,
  DeleteResult,
} from "@application/services/FileUploadService";
import { Logger } from "@shared/utils/Logger";
import streamifier from "streamifier";
import { CloudinaryResource } from "@application/use-cases/file/GetUserFilesUseCase";
import { UploadApiResponse } from "cloudinary";

@injectable()
export class CloudinaryService implements FileUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(
    fileBuffer: Buffer,
    userId: string,
    purpose: string,
    originalName: string
  ): Promise<FileUploadResult> {
    try {
      const timestamp = Date.now();
      const sanitizedOriginalName = originalName.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );
      const publicId = `${userId}_${timestamp}_${sanitizedOriginalName}`;

      Logger.info("Starting Cloudinary upload", {
        userId,
        purpose,
        originalName,
        publicId,
        fileSize: fileBuffer.length,
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `steerigo/${purpose}`,
            public_id: publicId,
            resource_type: "auto",
            transformation: [
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              Logger.error("Cloudinary upload failed", {
                userId,
                purpose,
                error: error.message,
              });
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else {
              Logger.info("Cloudinary upload successful", {
                userId,
                purpose,
                url: result!.secure_url,
                publicId: result!.public_id,
              });

              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
                filename: sanitizedOriginalName,
                size: result!.bytes || fileBuffer.length,
              });
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    } catch (error) {
      Logger.error("File upload service error", {
        userId,
        purpose,
        error: (error as Error).message,
      });
      throw new Error(`File upload service error: ${(error as Error).message}`);
    }
  }

  async delete(publicId: string): Promise<DeleteResult> {
    try {
      if (!publicId || publicId.trim() === "") {
        throw new Error("Public ID is required for deletion");
      }

      const result = await cloudinary.uploader.destroy(publicId);

      return { result: result.result };
    } catch (error) {
      Logger.error("File deletion failed", {
        publicId,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });

      throw new Error(
        `Failed to delete file from Cloudinary: ${(error as Error).message}`
      );
    }
  }

  async generateSignedUrl(
    publicId: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000) + expiresIn;
      const signedUrl = cloudinary.utils.private_download_url(publicId, "jpg", {
        expires_at: timestamp,
      });

      Logger.info("Generated signed URL", { publicId, expiresIn });
      return signedUrl;
    } catch (error) {
      Logger.error("Failed to generate signed URL", {
        publicId,
        error: (error as Error).message,
      });
      throw new Error(
        `Failed to generate signed URL: ${(error as Error).message}`
      );
    }
  }

  async validateFile(
    file: Express.Multer.File,
    purpose: string
  ): Promise<boolean> {
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      return false;
    }

    const allowedTypes = this.getAllowedMimeTypes(purpose);
    return allowedTypes.includes(file.mimetype);
  }

  private getAllowedMimeTypes(purpose: string): string[] {
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

  async listByPrefix(prefix: string): Promise<CloudinaryResource[]> {
    const response = await cloudinary.api.resources({
      type: "upload",
      prefix,
      max_results: 100,
    });

    type Resource = UploadApiResponse["resources"][0];

    return response.resources.map((r: Resource) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      format: r.format,
      bytes: r.bytes,
      created_at: r.created_at,
    }));
  }
}
