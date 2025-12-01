import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetCurrentUserDto } from "@application/dto/auth/GetCurrentUserDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetCurrentUserResponseDto } from "@application/dto/auth";
import { Result } from "@shared/utils/Result";

@injectable()
export class AuthUserController {
  constructor(
    @inject(TYPES.GetCurrentUserUseCase)
    private getCurrentUserUseCase: IUseCase<
      GetCurrentUserDto,
      Promise<Result<GetCurrentUserResponseDto>>
    >
  ) {}

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      // Handle missing auth user
      if (!userId) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: AuthMessages.UNAUTHORIZED,
        });
        return;
      }

      const dto = new GetCurrentUserDto({ userId });
      const result = await this.getCurrentUserUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_current_user"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: AuthMessages.USER_PROFILE_SUCCESS,
        data,
      };

      res.status(HttpStatusCodes.OK).json(response);
      Logger.info("Get current user completed successfully", {
        userId: dto.getUserId(),
      });
    } catch (error) {
      Logger.error("Get current user controller error", { error });

      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: AuthMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
