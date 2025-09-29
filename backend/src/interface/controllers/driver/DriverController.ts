import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RegisterDriverUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { RegisterDriverDto } from "@application/dto/driver/RegisterDriverDto";
import { validationResult } from "express-validator";

type MulterRequest = Request & { file?: Express.Multer.File };

@injectable()
export class DriverController {
  constructor(
    @inject(RegisterDriverUseCase)
    private registerDriverUseCase: RegisterDriverUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Missing user ID",
        });
        return;
      }

      console.log("Received driver registration data:", {
        ...req.body,
        // Don't log sensitive data in production
        licenseFrontImage: req.body.licenseFrontImage ? "[FILE]" : "missing",
        licenseBackImage: req.body.licenseBackImage ? "[FILE]" : "missing",
        idFrontImage: req.body.idFrontImage ? "[FILE]" : "missing",
        idBackImage: req.body.idBackImage ? "[FILE]" : "missing",
      });

      const dto = new RegisterDriverDto(req.body);
      const result = await this.registerDriverUseCase.execute(dto, userId);

      if (result.isFailure()) {
        res.status(400).json({
          success: false,
          message: result.getError().message,
        });
      } else {
        res.status(201).json({
          success: true,
          message: "Driver registration request submitted successfully.",
          data: {
            status: "pending_verification",
          },
        });
      }
    } catch (error) {
      console.error("Driver registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async uploadDocument(req: MulterRequest, res: Response): Promise<void> {
    try {
      const { fieldName } = req.body;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }

      // Mock URL for now - replace with actual cloud storage upload
      const mockUrl = `https://storage.example.com/${fieldName}-${Date.now()}.jpg`;

      res.status(200).json({
        success: true,
        url: mockUrl,
        message: "File uploaded successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }
  }
}
