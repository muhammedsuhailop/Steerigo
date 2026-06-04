import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { ApprovePayoutDto } from "@application/dto/admin/ApprovePayoutDto";
import { ApprovePayoutResponseDto } from "@application/dto/admin/ApprovePayoutResponseDto";
import { RejectPayoutDto } from "@application/dto/admin/RejectPayoutDto";
import { RejectPayoutResponseDto } from "@application/dto/admin/RejectPayoutResponseDto";
import { GetAdminPayoutsDto } from "@application/dto/admin/GetAdminPayoutsDto";
import { GetPayoutsResponseDto } from "@application/dto/admin/GetPayoutsResponseDto";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { ADMIN_MESSAGES } from "@shared/constants/AdminMessages";
import { ApiResponse } from "@shared/types/Common";

@injectable()
export class AdminPayoutController {
  constructor(
    @inject(TYPES.ApprovePayoutUseCase)
    private readonly approvePayoutUseCase: IUseCase<
      ApprovePayoutDto,
      Promise<Result<ApprovePayoutResponseDto>>
    >,

    @inject(TYPES.RejectPayoutUseCase)
    private readonly rejectPayoutUseCase: IUseCase<
      RejectPayoutDto,
      Promise<Result<RejectPayoutResponseDto>>
    >,

    @inject(TYPES.GetAdminPayoutsUseCase)
    private readonly getAdminPayoutsUseCase: IUseCase<
      GetAdminPayoutsDto,
      Promise<Result<GetPayoutsResponseDto>>
    >,
  ) {}

  async approvePayout(req: Request, res: Response): Promise<void> {
    try {
      const adminId = req.user!.userId;
      const { payoutId } = req.params;

      const dto = ApprovePayoutDto.create({
        adminId,
        payoutId: payoutId as string,
      });

      const result = await this.approvePayoutUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.PAYOUT.APPROVED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      Logger.error("AdminPayoutController.approvePayout error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }

  async rejectPayout(req: Request, res: Response): Promise<void> {
    try {
      const adminId = req.user!.userId;
      const { payoutId } = req.params;
      const { reason } = req.body;

      const dto = RejectPayoutDto.create({
        adminId,
        payoutId: payoutId as string,
        reason,
      });

      const result = await this.rejectPayoutUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.PAYOUT.REJECTED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      Logger.error("AdminPayoutController.rejectPayout error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }

  async getPayouts(req: Request, res: Response): Promise<void> {
    try {
      const { status, driverId, page, limit, sortBy, sortOrder } = req.query;

      const dto = GetAdminPayoutsDto.create({
        status: status as PayoutStatus | undefined,
        driverId: driverId as string | undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as "createdAt" | "amount" | undefined,
        sortOrder: sortOrder as "asc" | "desc" | undefined,
      });

      const result = await this.getAdminPayoutsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
        );

        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: ADMIN_MESSAGES.PAYOUT.RETRIVED,
        data: result.getValue(),
      } as ApiResponse);
    } catch (error) {
      Logger.error("AdminPayoutController.getPayouts error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(error);

      res.status(statusCode).json(response);
    }
  }
}
