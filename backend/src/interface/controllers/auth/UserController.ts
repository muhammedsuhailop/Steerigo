import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetCurrentUserUseCase } from "@application/use-cases/auth/GetCurrentUserUseCase";
import { GetCurrentUserDto } from "@application/dto/auth";
import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";

@injectable()
export class UserController {
  constructor(
    @inject(GetCurrentUserUseCase)
    private getCurrentUserUseCase: GetCurrentUserUseCase
  ) {}

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const dto = new GetCurrentUserDto(userId);
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

      const response: ApiResponse = {
        success: true,
        message: "User data fetched successfully",
        data: result.getValue(),
      };

      res.status(200).json(response);
      Logger.info("Current user fetched successfully", { userId });
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_current_user"
      );
      res.status(statusCode).json(response);
    }
  }
}
