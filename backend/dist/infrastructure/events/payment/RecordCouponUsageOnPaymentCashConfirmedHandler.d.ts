import { IEventHandler } from "../../../application/events/IEventHandler";
import { PaymentCashConfirmedEvent } from "../../../application/events/PaymentEvents";
import { ICouponUsageService } from "../../../application/services/ICouponUsageService";
import { IEventBus } from "../../../application/services/IEventBus";
export declare class RecordCouponUsageOnPaymentCashConfirmedHandler implements IEventHandler<PaymentCashConfirmedEvent> {
    private readonly eventBus;
    private readonly couponUsageService;
    constructor(eventBus: IEventBus, couponUsageService: ICouponUsageService);
    handle(event: PaymentCashConfirmedEvent): Promise<void>;
}
//# sourceMappingURL=RecordCouponUsageOnPaymentCashConfirmedHandler.d.ts.map