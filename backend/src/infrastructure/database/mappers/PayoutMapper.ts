import { Payout } from "@domain/entities/Payout";
import { IPayoutDocument } from "../models/PayoutModel";
import { Money } from "@domain/value-objects/Money";
import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
import { PayoutDestination } from "@domain/entities/Payout";

export class PayoutMapper {
  static toDomain(doc: IPayoutDocument): Payout {
    const amount = Money.create(doc.amount, doc.currency);

    const fee =
      doc.fee && doc.feeCurrency
        ? Money.create(doc.fee, doc.feeCurrency)
        : undefined;

    const destination = doc.destination as PayoutDestination | undefined;

    return Payout.fromData({
      id: doc.payoutId,
      driverId: doc.driverId,
      amount,
      currency: doc.currency,
      status: doc.status as PayoutStatus,
      method: doc.method as PayoutMethod,
      destination,
      externalPayoutId: doc.externalPayoutId,
      fee,
      failureReason: doc.failureReason,
      createdAt: doc.createdAt,
      processedAt: doc.processedAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: Payout) {
    const amount = entity.getAmount();
    const fee = entity.getFee();

    return {
      payoutId: entity.getId(),
      driverId: entity.getDriverId(),

      amount: amount.getAmount(),
      currency: amount.getCurrency(),

      status: entity.getStatus(),
      method: entity.getMethod(),

      destination: entity.getDestination(),

      externalPayoutId: entity.getExternalPayoutId(),

      fee: fee?.getAmount(),
      feeCurrency: fee?.getCurrency(),

      failureReason: entity.getFailureReason(),

      processedAt: entity.getProcessedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
