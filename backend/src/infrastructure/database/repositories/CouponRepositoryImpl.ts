import { injectable } from "inversify";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { Coupon } from "@domain/entities/Coupon";
import { CouponModel } from "../models/CouponModel";
import { CouponMapper } from "../mappers/CouponMapper";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class CouponRepositoryImpl implements ICouponRepository {
  async findById(id: string): Promise<Coupon | null> {
    try {
      const doc = await CouponModel.findById(id);
      return doc ? CouponMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding coupon by id", { id, error });
      throw error;
    }
  }

  async findByCode(code: string): Promise<Coupon | null> {
    try {
      const doc = await CouponModel.findOne({
        code: code.trim().toUpperCase(),
      });

      return doc ? CouponMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding coupon by code", { code, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await CouponModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking coupon existence", { id, error });
      throw error;
    }
  }

  async save(coupon: Coupon): Promise<Coupon> {
    try {
      const data = CouponMapper.toPersistence(coupon);

      const doc = await CouponModel.findOneAndUpdate(
        { code: coupon.getCode() },
        {
          ...data,
          updatedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      if (!doc) {
        throw new Error("Failed to save coupon");
      }

      Logger.info("Coupon saved successfully", {
        id: doc._id.toString(),
        code: doc.code,
      });

      return CouponMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving coupon", {
        code: coupon.getCode(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
