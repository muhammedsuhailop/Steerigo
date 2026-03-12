import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { InitiatePaymentDto } from "@application/dto/payment/InitiatePaymentDto";
import { InitiatePaymentResponseDto } from "@application/dto/payment/InitiatePaymentResponseDto";
import { VerifyPaymentDto } from "@application/dto/payment/VerifyPaymentDto";
import { VerifyPaymentResponseDto } from "@application/dto/payment/VerifyPaymentResponseDto";
import { ConfirmCashPaymentDto } from "@application/dto/payment/ConfirmCashPaymentDto";
import { ConfirmCashPaymentResponseDto } from "@application/dto/payment/ConfirmCashPaymentResponseDto";
import { Result } from "@shared/utils/Result";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class PaymentController {
  constructor(
    @inject(TYPES.InitiatePaymentUseCase)
    private readonly initiatePaymentUseCase: IUseCase<
      InitiatePaymentDto,
      Promise<Result<InitiatePaymentResponseDto>>
    >,
    @inject(TYPES.VerifyPaymentUseCase)
    private readonly verifyPaymentUseCase: IUseCase<
      VerifyPaymentDto,
      Promise<Result<VerifyPaymentResponseDto>>
    >,
    @inject(TYPES.ConfirmCashPaymentUseCase)
    private readonly confirmCashPaymentUseCase: IUseCase<
      ConfirmCashPaymentDto,
      Promise<Result<ConfirmCashPaymentResponseDto>>
    >,
  ) {}

  async initiatePayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { rideId, method } = req.body;

      const dto = InitiatePaymentDto.create({ userId, rideId, method });
      const result = await this.initiatePaymentUseCase.execute(dto);

      if (result.isFailure()) {
        next(result.getError());
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("PaymentController.initiatePayment error", { error });
      next(error);
    }
  }

  async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { paymentId, gatewayOrderId, gatewayPaymentId, gatewaySignature } =
        req.body;

      const dto = VerifyPaymentDto.create({
        userId,
        paymentId,
        gatewayOrderId,
        gatewayPaymentId,
        gatewaySignature,
      });

      const result = await this.verifyPaymentUseCase.execute(dto);

      if (result.isFailure()) {
        next(result.getError());
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("PaymentController.verifyPayment error", { error });
      next(error);
    }
  }

  async confirmCashPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { paymentId } = req.params;

      const dto = ConfirmCashPaymentDto.create({ userId, paymentId });
      const result = await this.confirmCashPaymentUseCase.execute(dto);

      if (result.isFailure()) {
        next(result.getError());
        return;
      }

      res.status(HttpStatusCodes.OK).json(result.getValue());
    } catch (error) {
      Logger.error("PaymentController.confirmCashPayment error", { error });
      next(error);
    }
  }
}
