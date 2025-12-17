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
import { UserRole } from "@shared/constants/AuthConstants";

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
    >
  ) {}

  private getUserId(req: Request): string | null {
    const user = req.user;
    return user?.userId ?? null;
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: USER_MESSAGES.PROFILE.UNAUTHORIZED,
        });
        return;
      }

      const { userId } = req.params;

      const currentUser = req.user;
      if (userId !== currentUserId && currentUser?.role !== "Admin") {
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: USER_MESSAGES.PROFILE.ACCESS_DENIED_VIEW,
        });
        return;
      }

      const dto = GetUserProfileDto.fromRequest(userId);
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
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: USER_MESSAGES.PROFILE.UNAUTHORIZED,
        });
        return;
      }

      const { userId } = req.params;
      const currentUser = req.user;

      if (userId !== currentUserId && currentUser?.role !== UserRole.ADMIN) {
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: USER_MESSAGES.PROFILE.ACCESS_DENIED_UPDATE,
        });
        return;
      }

      const body = req.body as UserProfileRequestBody;

      const dto = UpdateUserProfileDto.fromRequest(userId, body);

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
      const currentUserId = this.getUserId(req);
      if (!currentUserId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: USER_MESSAGES.PROFILE.UNAUTHORIZED,
        });
        return;
      }

      const { userId } = req.params;

      if (userId !== currentUserId) {
        Logger.warn("User ID mismatch in register as driver", {
          currentUserId,
          urlUserId: userId,
          currentUserIdLength: currentUserId?.length,
          urlUserIdLength: userId?.length,
          tokenUser: req.user,
        });
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: USER_MESSAGES.PROFILE.ACCESS_DENIED_REGISTER_DRIVER,
        });
        return;
      }

      const dto = RegisterAsDriverRequestDto.fromRequest(userId);
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
        message: USER_MESSAGES.PROFILE.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
