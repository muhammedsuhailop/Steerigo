import { Ride } from "@domain/entities/Ride";
import { Payment } from "@domain/entities/Payment";
import { Money } from "@domain/value-objects/Money";
import { Result } from "@shared/utils/Result";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
export interface PaymentStrategyParams {
    payment: Payment;
    ride: Ride;
    amount: Money;
    userId: string;
}
export interface IPaymentStrategy<T> {
    getMethod(): PaymentMethod;
    execute(params: PaymentStrategyParams): Promise<Result<T>>;
    getSuccessMessage(): string;
}
//# sourceMappingURL=IPaymentStrategy.d.ts.map