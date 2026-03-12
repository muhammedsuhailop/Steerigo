import { IPaymentDocument } from "../models/PaymentModel";
import { Payment } from "@domain/entities/Payment";
import { Money } from "@domain/value-objects/Money";
import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
import { Types } from "mongoose";

export class PaymentMapper {
  static toDomain(doc: IPaymentDocument): Payment {
    const amount = Money.create(doc.amount, doc.currency);
    const refundedAmount = Money.create(doc.refundedAmount ?? 0, doc.currency);

    return Payment.fromData({
      id: doc.paymentId,
      rideId: doc.rideId,
      riderId: doc.riderId.toString(),
      driverId: doc.driverId ? doc.driverId.toString() : "",
      amount,
      refundedAmount,
      method: doc.method as PaymentMethod,
      status: doc.status as PaymentStatus,
      paymentIntentId: doc.paymentIntentId,
      gateway: doc.gateway,
      gatewayOrderId: doc.gatewayOrderId,
      gatewayPaymentId: doc.gatewayPaymentId,
      gatewaySignature: doc.gatewaySignature,
      failureReason: doc.failureReason,
      metadata: (doc.metadata as Record<string, string>) ?? {},
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: Payment): Partial<IPaymentDocument> {
    const currency = entity.getAmount().getCurrency();
    return {
      paymentId: entity.getId(),
      rideId: entity.getRideId(),
      riderId: new Types.ObjectId(entity.getRiderId()),
      driverId: entity.getDriverId()
        ? new Types.ObjectId(entity.getDriverId())
        : undefined,
      amount: entity.getAmount().getAmount(),
      refundedAmount: entity.getRefundedAmount().getAmount(),
      currency,
      method: entity.getMethod(),
      status: entity.getStatus(),
      paymentIntentId: entity.getPaymentIntentId(),
      gateway: entity.getGateway(),
      gatewayOrderId: entity.getGatewayOrderId(),
      gatewayPaymentId: entity.getGatewayPaymentId(),
      gatewaySignature: entity.getGatewaySignature(),
      failureReason: entity.getFailureReason(),
      metadata: entity.getMetadata() ? { ...entity.getMetadata() } : {},
      paidAt: entity.getPaidAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
