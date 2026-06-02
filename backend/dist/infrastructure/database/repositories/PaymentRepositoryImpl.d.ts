import { Payment } from "../../../domain/entities/Payment";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
export declare class PaymentRepositoryImpl implements IPaymentRepository {
    findById(id: string): Promise<Payment | null>;
    findByRideId(rideId: string): Promise<Payment | null>;
    findByRiderId(riderId: string): Promise<Payment[]>;
    save(payment: Payment): Promise<Payment>;
    exists(id: string): Promise<boolean>;
    delete(id: string): Promise<void>;
    findSuccessfulByRideId(rideId: string): Promise<Payment | null>;
}
//# sourceMappingURL=PaymentRepositoryImpl.d.ts.map