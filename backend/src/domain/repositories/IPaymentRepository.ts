import { Payment } from "@domain/entities/Payment";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";

export interface IPaymentRepository
  extends IWriteOnlyRepository<Payment>,
    IReadOnlyRepository<Payment> {
  findByRideId(rideId: string): Promise<Payment | null>;
  findByRiderId(riderId: string): Promise<Payment[]>;
}
