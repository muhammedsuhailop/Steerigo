import { injectable } from "inversify";
import {
  CouponQueryOptions,
  ICouponRepository,
  PaginatedCoupons,
} from "@domain/repositories/ICouponRepository";
import { Coupon } from "@domain/entities/Coupon";
import { CouponModel, ICouponDocument } from "../models/CouponModel";
import { CouponMapper } from "../mappers/CouponMapper";
import { Logger } from "@shared/utils/Logger";
import { FilterQuery, SortOrder } from "mongoose";

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

  async findAll(options: CouponQueryOptions): Promise<PaginatedCoupons> {
    try {
      const { filters, sortBy, sortOrder, page, limit } = options;

      const query: FilterQuery<typeof CouponModel> = {};

      if (filters.code) {
        query["code"] = {
          $regex: filters.code.trim().toUpperCase(),
          $options: "i",
        };
      }

      if (filters.discountType) {
        query["discountType"] = filters.discountType;
      }

      if (filters.isActive !== undefined) {
        query["isActive"] = filters.isActive;
      }

      if (filters.validFromStart || filters.validFromEnd) {
        query["validFrom"] = {};
        if (filters.validFromStart) {
          (query["validFrom"] as Record<string, Date>)["$gte"] =
            filters.validFromStart;
        }
        if (filters.validFromEnd) {
          (query["validFrom"] as Record<string, Date>)["$lte"] =
            filters.validFromEnd;
        }
      }

      if (filters.validToStart || filters.validToEnd) {
        query["validTo"] = {};
        if (filters.validToStart) {
          (query["validTo"] as Record<string, Date>)["$gte"] =
            filters.validToStart;
        }
        if (filters.validToEnd) {
          (query["validTo"] as Record<string, Date>)["$lte"] =
            filters.validToEnd;
        }
      }

      const mongoSortOrder: SortOrder = sortOrder === "asc" ? 1 : -1;
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        CouponModel.find(query)
          .sort({ [sortBy]: mongoSortOrder })
          .skip(skip)
          .limit(limit)
          .lean(),
        CouponModel.countDocuments(query),
      ]);

      const coupons = docs.map((doc) =>
        CouponMapper.toDomain(doc as unknown as ICouponDocument),
      );

      return {
        coupons,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      Logger.error("Error finding all coupons", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
