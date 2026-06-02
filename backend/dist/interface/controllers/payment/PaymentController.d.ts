import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { InitiatePaymentDto } from "@application/dto/payment/InitiatePaymentDto";
import { InitiatePaymentResponseDto } from "@application/dto/payment/InitiatePaymentResponseDto";
import { VerifyPaymentDto } from "@application/dto/payment/VerifyPaymentDto";
import { VerifyPaymentResponseDto } from "@application/dto/payment/VerifyPaymentResponseDto";
import { ConfirmCashPaymentDto } from "@application/dto/payment/ConfirmCashPaymentDto";
import { ConfirmCashPaymentResponseDto } from "@application/dto/payment/ConfirmCashPaymentResponseDto";
import { Result } from "@shared/utils/Result";
import { MarkPaymentFailedDto } from "@application/dto/payment/MarkPaymentFailedDto";
import { MarkPaymentFailedResponseDto } from "@application/dto/payment/MarkPaymentFailedResponseDto";
export declare class PaymentController {
    private readonly initiatePaymentUseCase;
    private readonly verifyPaymentUseCase;
    private readonly confirmCashPaymentUseCase;
    private readonly markPaymentFailedUseCase;
    constructor(initiatePaymentUseCase: IUseCase<InitiatePaymentDto, Promise<Result<InitiatePaymentResponseDto>>>, verifyPaymentUseCase: IUseCase<VerifyPaymentDto, Promise<Result<VerifyPaymentResponseDto>>>, confirmCashPaymentUseCase: IUseCase<ConfirmCashPaymentDto, Promise<Result<ConfirmCashPaymentResponseDto>>>, markPaymentFailedUseCase: IUseCase<MarkPaymentFailedDto, Promise<Result<MarkPaymentFailedResponseDto>>>);
    initiatePayment(req: Request, res: Response): Promise<void>;
    verifyPayment(req: Request, res: Response): Promise<void>;
    confirmCashPayment(req: Request, res: Response): Promise<void>;
    markPaymentFailed(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PaymentController.d.ts.map