import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { GetUsersRequestDto } from "@application/dto/admin/GetUsersRequestDto";
import { UpdateUserStatusRequestDto } from "@application/dto/admin/UpdateUserStatusRequestDto";
import { ApiResponse } from "@shared/types/Common";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { TYPES } from "@shared/constants/DITypes";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  GetUsersResponseDto,
  UpdateUserStatusResponseDto,
} from "@application/dto/admin";
import { Result } from "@shared/utils/Result";

@injectable()
export class AdminUserController {
  constructor(
    @inject(TYPES.GetUsersUseCase)
    private getUsersUseCase: IUseCase<
      GetUsersRequestDto,
      Promise<Result<GetUsersResponseDto>>
    >,
    @inject(TYPES.UpdateUserStatusUseCase)
    private updateUserStatusUseCase: IUseCase<
      UpdateUserStatusRequestDto,
      Promise<Result<UpdateUserStatusResponseDto>>
    >
  ) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const dto = GetUsersRequestDto.fromRequest(req.query);
      const result = await this.getUsersUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "get_users"
        );
        res.status(statusCode).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: ADMIN_MESSAGES.USER.USERS_FETCHED,
        data: result.getValue(),
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_users"
      );
      res.status(statusCode).json(response);
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const dto = UpdateUserStatusRequestDto.fromRequest(
        req.params.userId,
        req.body
      );

      const result = await this.updateUserStatusUseCase.execute(dto);

      if (result.isFailure()) {
        const error = result.getError();
        const { response, statusCode } = ErrorHandlerService.handleError(
          error,
          "update_user_status"
        );
        res.status(statusCode).json(response);
        return;
      }

      const data = result.getValue();
      const response: ApiResponse = {
        success: true,
        message: data.message || ADMIN_MESSAGES.USER.USER_STATUS_UPDATED,
        data: {
          userId: data.userId,
          newStatus: data.newStatus,
        },
      };

      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "update_user_status"
      );
      res.status(statusCode).json(response);
    }
  }
}
