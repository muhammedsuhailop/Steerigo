import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetCurrentUserUseCase } from "@application/use-cases/auth/GetCurrentUserUseCase";
import { GetCurrentUserDto } from "@application/dto/auth/GetCurrentUserDto";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { AuthMessages } from "@shared/constants/AuthConstants";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.GetCurrentUserUseCase)
    private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId; // From auth middleware
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

      res.status(200).json(response);
      Logger.info("Get current user completed successfully", {
        userId: dto.getUserId(),
      });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_current_user"
      );
      res.status(statusCode).json(response);
    }
  }
}
