import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { GetUserProfileDto } from "@application/dto/user/GetUserProfileDto";
import { UpdateUserProfileDto } from "@application/dto/user/UpdateUserProfileDto";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import {
  RegisterAsDriverRequestDto,
  RegisterAsDriverResponseDto,
  UserProfileUpdateResponseDto,
  UserResponseDto,
} from "@application/dto/user";
import { USER_MESSAGES } from "@shared/constants/UserMessages";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetUserStatsRequestDto } from "@application/dto/user/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "@application/dto/user/GetUserStatsResponseDto";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

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
    private getUserProfileUseCase: IUseCase<
      GetUserProfileDto,
      Promise<Result<UserResponseDto>>
    >,
    @inject(TYPES.UpdateUserProfileUseCase)
    private updateUserProfileUseCase: IUseCase<
      UpdateUserProfileDto,
      Promise<Result<UserProfileUpdateResponseDto>>
    >,
    @inject(TYPES.RegisterUserAsDriverUseCase)
    private registerUserAsDriverUseCase: IUseCase<
      RegisterAsDriverRequestDto,
      Promise<Result<RegisterAsDriverResponseDto>>
    >,

    @inject(TYPES.GetUserStatsUseCase)
    private readonly getUserStatsUseCase: IUseCase<
      GetUserStatsRequestDto,
      Promise<Result<GetUserStatsResponseDto>>
    >,
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const dto = GetUserProfileDto.fromRequest(userId as string);
      const result = await this.getUserProfileUseCase.execute(dto);

      if (result.isSuccessful()) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: USER_MESSAGES.PROFILE.PROFILE_FETCHED,
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
        message: USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserId(req);

      const body = req.body as UserProfileRequestBody;

      const dto = UpdateUserProfileDto.fromRequest(userId as string, body);

      const result = await this.updateUserProfileUseCase.execute(dto);

      if (result.isSuccessful()) {
        const responseData = result.getValue();
        res.status(HttpStatusCodes.OK).json({
          success: true,
          message: USER_MESSAGES.PROFILE.PROFILE_UPDATED,
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
        message: USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async registerAsDriver(req: Request, res: Response): Promise<void> {
    try {

      const userId = this.getUserId(req);

      const dto = RegisterAsDriverRequestDto.fromRequest(userId as string);
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
        message: USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getMyStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const dto = GetUserStatsRequestDto.fromRequest(
        userId,
        req.query as Record<string, unknown>,
      );

      const result = await this.getUserStatsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "user_get_stats",
        );
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: USER_MESSAGES.PROFILE.STATS_FETCHED,
        data: result.getValue(),
      });
    } catch (error) {
      Logger.error("UserProfileController.getMyStats error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "user_get_stats",
      );

      res.status(statusCode).json(response);
    }
  }
}
