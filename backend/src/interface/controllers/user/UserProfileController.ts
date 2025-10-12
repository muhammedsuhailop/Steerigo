import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { GetUserProfileUseCase } from "@application/use-cases/user/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "@application/use-cases/user/UpdateUserProfileUseCase";
import { GetUserProfileDto } from "@application/dto/user/GetUserProfileDto";
import { UpdateUserProfileDto } from "@application/dto/user/UpdateUserProfileDto";
import { ApiResponse } from "@shared/types/Common";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RegisterAsDriverRequestDto } from "@application/dto/user";
import { RegisterUserAsDriverUseCase } from "@application/use-cases/user/RegisterUserAsDriverUseCase";

interface UserProfileRequestBody {
  name?: string;
  mobile?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  profilePicture?: string;
}

@injectable()
export class UserProfileController {
  constructor(
    @inject(TYPES.GetUserProfileUseCase)
    private getUserProfileUseCase: GetUserProfileUseCase,
    @inject(TYPES.UpdateUserProfileUseCase)
    private updateUserProfileUseCase: UpdateUserProfileUseCase,
    @inject(TYPES.RegisterUserAsDriverUseCase)
    private registerUserAsDriverUseCase: RegisterUserAsDriverUseCase
  ) {}

  private getUserId(req: Request): string | null {
    const user = (req as any).user;
    return user?.userId ?? null;
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const { userId } = req.params;

      const currentUser = (req as any).user;
      if (userId !== currentUserId && currentUser?.role !== "Admin") {
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Access denied. You can only view your own profile.",
        });
        return;
      }

      const dto = new GetUserProfileDto(userId);
      const result = await this.getUserProfileUseCase.execute(dto);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: "User profile fetched successfully",
          data: result.getValue(),
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Get user profile controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const { userId } = req.params;

      const currentUser = (req as any).user;
      if (userId !== currentUserId && currentUser?.role !== "Admin") {
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Access denied. You can only update your own profile.",
        });
        return;
      }

      const body = req.body as UserProfileRequestBody;
      const dto = new UpdateUserProfileDto({ ...body, userId });

      const result = await this.updateUserProfileUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: "User profile updated successfully",
          data: responseData.user,
          updateSummary: {
            updatedFields: responseData.updatedFields,
          },
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }
    } catch (error) {
      Logger.error("Update user profile controller error", { error });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async registerAsDriver(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const { userId } = req.params;

      if (userId !== currentUserId) {
        Logger.warn("User ID mismatch in register as driver", {
          currentUserId,
          urlUserId: userId,
          currentUserIdLength: currentUserId?.length,
          urlUserIdLength: userId?.length,
          tokenUser: (req as any).user,
        });
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Access denied. You can only register yourself as a driver.",
        });
        return;
      }

      const dto = new RegisterAsDriverRequestDto(userId);
      const result = await this.registerUserAsDriverUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: responseData.message,
          data: {
            id: responseData.id,
            name: responseData.name,
            email: responseData.email,
            mobile: responseData.mobile,
            role: responseData.role,
            status: responseData.status,
            isVerified: responseData.isVerified,
            updatedAt: responseData.updatedAt,
          },
        });
      } else {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.getError().message,
        });
      }

      Logger.info("Register as driver request processed", {
        userId,
        currentUserId,
        success: result.isSuccessful(),
      });
    } catch (error) {
      Logger.error("Register as driver controller error", {
        error,
        userId: req.params.userId,
        currentUserId: this.getUserId(req),
      });
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
