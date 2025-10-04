import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { GetUserProfileUseCase } from "@application/use-cases/user/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "@application/use-cases/user/UpdateUserProfileUseCase";
import { GetUserProfileDto, UpdateUserProfileDto } from "@application/dto/user";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class UserProfileController {
  constructor(
    @inject(GetUserProfileUseCase)
    private getUserProfileUseCase: GetUserProfileUseCase,
    @inject(UpdateUserProfileUseCase)
    private updateUserProfileUseCase: UpdateUserProfileUseCase
  ) {}

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const { userId } = req.params;
      const currentUserId = req.user!.userId;

      // Users can only access their own profile (unless admin)
      if (userId !== currentUserId && req.user!.role !== "Admin") {
        const response: ApiResponse = {
          success: false,
          message: "Access denied. You can only view your own profile.",
        };
        res.status(403).json(response);
        return;
      }

      const dto = new GetUserProfileDto(userId);
      const result = await this.getUserProfileUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_user_profile"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "User profile fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
      Logger.info("User profile fetched successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_user_profile"
      );
      res.status(statusCode).json(response);
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { response, statusCode } =
          ErrorHandlerService.handleValidationErrors(errors.array());
        res.status(statusCode).json(response);
        return;
      }

      const { userId } = req.params;
      const currentUserId = req.user!.userId;

      // Users can only update their own profile (unless admin)
      if (userId !== currentUserId && req.user!.role !== "Admin") {
        const response: ApiResponse = {
          success: false,
          message: "Access denied. You can only update your own profile.",
        };
        res.status(403).json(response);
        return;
      }

      const dto = new UpdateUserProfileDto({ ...req.body, userId });
      const result = await this.updateUserProfileUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_user_profile"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: "User profile updated successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
      Logger.info("User profile updated successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_user_profile"
      );
      res.status(statusCode).json(response);
    }
  }
}
