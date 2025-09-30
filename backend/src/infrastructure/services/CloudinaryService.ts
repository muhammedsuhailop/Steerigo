import { injectable } from "inversify";
import { v2 as cloudinary } from "cloudinary";
import { IFileUploadService } from "@domain/services/IFileUploadService";
import streamifier from "streamifier";

@injectable()
export class CloudinaryService implements IFileUploadService {
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
    purpose: string
  ): Promise<{
    url: string;
    publicId: string;
  }> {
    try {
      const timestamp = Date.now();
      const publicId = `${userId}_${purpose}_${timestamp}`;

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "steerigo",
            public_id: publicId,
            resource_type: "auto",
            transformation: [
              { quality: "auto:good" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else {
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
              });
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`File upload service error: ${(error as Error).message}`);
    }
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`File deletion failed: ${(error as Error).message}`);
    }
  }
}
