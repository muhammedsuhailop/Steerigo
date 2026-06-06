"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const inversify_1 = require("inversify");
const InitiatePaymentDto_1 = require("../../../application/dto/payment/InitiatePaymentDto");
const VerifyPaymentDto_1 = require("../../../application/dto/payment/VerifyPaymentDto");
const ConfirmCashPaymentDto_1 = require("../../../application/dto/payment/ConfirmCashPaymentDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const MarkPaymentFailedDto_1 = require("../../../application/dto/payment/MarkPaymentFailedDto");
let PaymentController = class PaymentController {
    constructor(initiatePaymentUseCase, verifyPaymentUseCase, confirmCashPaymentUseCase, markPaymentFailedUseCase) {
        this.initiatePaymentUseCase = initiatePaymentUseCase;
        this.verifyPaymentUseCase = verifyPaymentUseCase;
        this.confirmCashPaymentUseCase = confirmCashPaymentUseCase;
        this.markPaymentFailedUseCase = markPaymentFailedUseCase;
    }
    async initiatePayment(req, res) {
        try {
            const userId = req.user.userId;
            const { rideId, method } = req.body;
            const dto = InitiatePaymentDto_1.InitiatePaymentDto.create({ userId, rideId, method });
            const result = await this.initiatePaymentUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "initiate_payment");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("PaymentController.initiatePayment error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "initiate_payment");
            res.status(statusCode).json(response);
        }
    }
    async verifyPayment(req, res) {
        try {
            const userId = req.user.userId;
            const { paymentId, gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;
            const dto = VerifyPaymentDto_1.VerifyPaymentDto.create({
                userId,
                paymentId,
                gatewayOrderId,
                gatewayPaymentId,
                gatewaySignature,
            });
            const result = await this.verifyPaymentUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "verify_payment");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("PaymentController.verifyPayment error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "verify_payment");
            res.status(statusCode).json(response);
        }
    }
    async confirmCashPayment(req, res) {
        try {
            const userId = req.user.userId;
            const { rideId, method, amount } = req.body;
            const dto = ConfirmCashPaymentDto_1.ConfirmCashPaymentDto.create({
                userId,
                rideId,
                method,
                amount,
            });
            const result = await this.confirmCashPaymentUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "confirm_cash_payment");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("PaymentController.confirmCashPayment error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "confirm_cash_payment");
            res.status(statusCode).json(response);
        }
    }
    async markPaymentFailed(req, res) {
        try {
            const userId = req.user.userId;
            const dto = MarkPaymentFailedDto_1.MarkPaymentFailedDto.fromRequest(userId, req.body);
            const result = await this.markPaymentFailedUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "mark_payment_failed");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("PaymentController.markPaymentFailed error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_payment_failed");
            res.status(statusCode).json(response);
        }
    }
};
exports.PaymentController = PaymentController;
exports.PaymentController = PaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.InitiatePaymentUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.VerifyPaymentUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.ConfirmCashPaymentUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.MarkPaymentFailedUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], PaymentController);
//# sourceMappingURL=PaymentController.js.map