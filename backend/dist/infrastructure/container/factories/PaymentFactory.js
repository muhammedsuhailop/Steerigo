"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const RazorpayService_1 = require("../../services/RazorpayService");
const InitiatePaymentUseCase_1 = require("../../../application/use-cases/payment/InitiatePaymentUseCase");
const VerifyPaymentUseCase_1 = require("../../../application/use-cases/payment/VerifyPaymentUseCase");
const ConfirmCashPaymentUseCase_1 = require("../../../application/use-cases/payment/ConfirmCashPaymentUseCase");
const PaymentController_1 = require("../../../interface/controllers/payment/PaymentController");
const EarningsDistributionService_1 = require("../../services/EarningsDistributionService");
const MarkPaymentFailedUseCase_1 = require("../../../application/use-cases/payment/MarkPaymentFailedUseCase");
const PaymentNotificationService_1 = require("../../services/PaymentNotificationService");
const OnlinePaymentStrategy_1 = require("../../services/payment/OnlinePaymentStrategy");
const WalletPaymentStrategy_1 = require("../../services/payment/WalletPaymentStrategy");
const CashPaymentStrategy_1 = require("../../services/payment/CashPaymentStrategy");
class PaymentFactory {
    static register(container) {
        // Services
        container
            .bind(DITypes_1.TYPES.PaymentGatewayService)
            .to(RazorpayService_1.RazorpayService)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.EarningsDistributionService)
            .to(EarningsDistributionService_1.EarningsDistributionService)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.PaymentNotificationService)
            .to(PaymentNotificationService_1.PaymentNotificationService);
        container
            .bind(DITypes_1.TYPES.PaymentStrategies)
            .to(OnlinePaymentStrategy_1.OnlinePaymentStrategy);
        container
            .bind(DITypes_1.TYPES.PaymentStrategies)
            .to(WalletPaymentStrategy_1.WalletPaymentStrategy);
        container
            .bind(DITypes_1.TYPES.PaymentStrategies)
            .to(CashPaymentStrategy_1.CashPaymentStrategy);
        // Use Cases
        container
            .bind(DITypes_1.TYPES.InitiatePaymentUseCase)
            .to(InitiatePaymentUseCase_1.InitiatePaymentUseCase);
        container
            .bind(DITypes_1.TYPES.VerifyPaymentUseCase)
            .to(VerifyPaymentUseCase_1.VerifyPaymentUseCase);
        container
            .bind(DITypes_1.TYPES.ConfirmCashPaymentUseCase)
            .to(ConfirmCashPaymentUseCase_1.ConfirmCashPaymentUseCase);
        container.bind(DITypes_1.TYPES.MarkPaymentFailedUseCase).to(MarkPaymentFailedUseCase_1.MarkPaymentFailedUseCase);
        // Controller
        container
            .bind(DITypes_1.TYPES.PaymentController)
            .to(PaymentController_1.PaymentController);
    }
}
exports.PaymentFactory = PaymentFactory;
//# sourceMappingURL=PaymentFactory.js.map