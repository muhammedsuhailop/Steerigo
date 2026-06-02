import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateCouponDto } from "@application/dto/admin/CreateCouponDto";
import { CreateCouponResponseDto } from "@application/dto/admin/CreateCouponResponseDto";
import { EditCouponDto } from "@application/dto/admin/EditCouponDto";
import { EditCouponResponseDto } from "@application/dto/admin/EditCouponResponseDto";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { ErrorHandlerService } from "@shared/utils/ErrorHandlerService";
import { ApiResponse } from "@shared/types/Common";
import { GetAdminCouponsDto } from "@application/dto/admin/GetAdminCouponsDto";
import { GetAdminCouponsResponseDto } from "@application/dto/admin/GetAdminCouponsResponseDto";

@injectable()
export class AdminCouponController {
  constructor(
    @inject(TYPES.CreateCouponUseCase)
    private readonly createCouponUseCase: IUseCase<
      CreateCouponDto,
      Promise<Result<CreateCouponResponseDto>>
    >,

    @inject(TYPES.EditCouponUseCase)
    private readonly editCouponUseCase: IUseCase<
      EditCouponDto,
      Promise<Result<EditCouponResponseDto>>
    >,
    

    @inject(TYPES.GetAdminCouponsUseCase)
    private readonly getAdminCouponsUseCase: IUseCase<
      GetAdminCouponsDto,
      Promise<Result<GetAdminCouponsResponseDto>>
    >,
  ) {}

  async getCoupons(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin get coupons request received", { query: req.query });

      const dto = GetAdminCouponsDto.fromRequest(req.query);

      const result = await this.getAdminCouponsUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "get_admin_coupons",
        );
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue() as ApiResponse);
    } catch (error) {
      Logger.error("AdminCouponController.getCoupons error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "get_admin_coupons",
      );
      res.status(statusCode).json(response);
    }
  }

  async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      Logger.info("Admin create coupon request received", { body: req.body });

      const dto = CreateCouponDto.fromRequest(req.body);

      const result = await this.createCouponUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "create_coupon",
        );
        res.status(statusCode).json(response);
        return;
      }

      res
        .status(HttpStatusCodes.CREATED)
        .json(result.getValue() as ApiResponse);
    } catch (error) {
      Logger.error("AdminCouponController.createCoupon error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "create_coupon",
      );
      res.status(statusCode).json(response);
    }
  }

  async editCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { couponId } = req.params;

      Logger.info("Admin edit coupon request received", {
        couponId,
        body: req.body,
      });

      const dto = EditCouponDto.fromRequest(
        { couponId: couponId as string },
        req.body,
      );

      const result = await this.editCouponUseCase.execute(dto);

      if (result.isFailure()) {
        const { response, statusCode } = ErrorHandlerService.handleError(
          result.getError(),
          "edit_coupon",
        );
        res.status(statusCode).json(response);
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue() as ApiResponse);
    } catch (error) {
      Logger.error("AdminCouponController.editCoupon error", { error });

      const { response, statusCode } = ErrorHandlerService.handleError(
        error,
        "edit_coupon",
      );
      res.status(statusCode).json(response);
    }
  }
}
