import { IPaymentDocument } from "../models/PaymentModel";
import { Payment } from "../../../domain/entities/Payment";
export declare class PaymentMapper {
    static toDomain(doc: IPaymentDocument): Payment;
    static toPersistence(entity: Payment): Partial<IPaymentDocument>;
}
//# sourceMappingURL=PaymentMapper.d.ts.map