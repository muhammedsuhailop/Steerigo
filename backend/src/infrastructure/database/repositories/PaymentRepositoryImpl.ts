import { injectable } from "inversify";
import { IPaymentDocument, PaymentModel } from "../models/PaymentModel";
import { PaymentMapper } from "../mappers/PaymentMapper";
import { Payment } from "@domain/entities/Payment";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { Logger } from "@shared/utils/Logger";
import { Types } from "mongoose";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";

@injectable()
export class PaymentRepositoryImpl implements IPaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    try {
      const doc = await PaymentModel.findOne({ paymentId: id }).exec();
      return doc ? PaymentMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding payment by id", { id, error });
      throw error;
    }
  }

  async findByRideId(rideId: string): Promise<Payment | null> {
    try {
      const doc = await PaymentModel.findOne({ rideId }).exec();
      return doc ? PaymentMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding payment by rideId", { rideId, error });
      throw error;
    }
  }

  async findByRiderId(riderId: string): Promise<Payment[]> {
    try {
      const docs = await PaymentModel.find({
        riderId: new Types.ObjectId(riderId),
      })
        .sort({ createdAt: -1 })
        .exec();
      return docs.map(PaymentMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding payments by riderId", { riderId, error });
      throw error;
    }
  }

  async save(payment: Payment): Promise<Payment> {
    try {
      const persistence = PaymentMapper.toPersistence(payment);

      const doc = await PaymentModel.findOneAndUpdate(
        { paymentId: payment.getId() },
        {
          ...persistence,
          updatedAt: new Date(),
        } as Partial<IPaymentDocument>,
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
      ).exec();

      if (!doc) {
        throw new Error(`Failed to save payment ${payment.getId()}`);
      }

      Logger.info("Payment saved/updated", {
        paymentId: doc.paymentId,
        rideId: doc.rideId,
        status: doc.status,
      });

      return PaymentMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving payment", {
        paymentId: payment.getId(),
        error,
      });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await PaymentModel.countDocuments({ paymentId: id }).exec();
      return count > 0;
    } catch (error) {
      Logger.error("Error checking payment existence", { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await PaymentModel.findOneAndDelete({
        paymentId: id,
      }).exec();
      if (result) {
        Logger.info("Payment deleted", { paymentId: id });
      } else {
        Logger.warn("Payment not found for deletion", { paymentId: id });
      }
    } catch (error) {
      Logger.error("Error deleting payment", { paymentId: id, error });
      throw error;
    }
  }

  async findSuccessfulByRideId(rideId: string): Promise<Payment | null> {
    try {
      const doc = await PaymentModel.findOne({
        rideId,
        status: PaymentStatus.SUCCESS,
      }).exec();

      return doc ? PaymentMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding successful payment by rideId", {
        rideId,
        error,
      });
      throw error;
    }
  }
}
