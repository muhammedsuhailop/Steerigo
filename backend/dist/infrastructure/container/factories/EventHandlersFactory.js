"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlersFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const RecordCouponUsageOnPaymentSucceededHandler_1 = require("../../events/payment/RecordCouponUsageOnPaymentSucceededHandler");
const RecordCouponUsageOnPaymentCashConfirmedHandler_1 = require("../../events/payment/RecordCouponUsageOnPaymentCashConfirmedHandler");
class EventHandlersFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.CouponUsageOnPaymentSucceededHandler)
            .to(RecordCouponUsageOnPaymentSucceededHandler_1.RecordCouponUsageOnPaymentSucceededHandler)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.CouponUsageOnPaymentCashConfirmedHandler)
            .to(RecordCouponUsageOnPaymentCashConfirmedHandler_1.RecordCouponUsageOnPaymentCashConfirmedHandler)
            .inSingletonScope();
    }
    static init(container) {
        container.get(DITypes_1.TYPES.CouponUsageOnPaymentSucceededHandler);
        container.get(DITypes_1.TYPES.CouponUsageOnPaymentCashConfirmedHandler);
    }
}
exports.EventHandlersFactory = EventHandlersFactory;
//# sourceMappingURL=EventHandlersFactory.js.map