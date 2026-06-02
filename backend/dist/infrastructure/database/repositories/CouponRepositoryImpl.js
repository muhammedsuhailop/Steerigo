"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const CouponModel_1 = require("../models/CouponModel");
const CouponMapper_1 = require("../mappers/CouponMapper");
const Logger_1 = require("@shared/utils/Logger");
let CouponRepositoryImpl = class CouponRepositoryImpl {
    async findById(id) {
        try {
            const doc = await CouponModel_1.CouponModel.findById(id);
            return doc ? CouponMapper_1.CouponMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding coupon by id", { id, error });
            throw error;
        }
    }
    async findByCode(code) {
        try {
            const doc = await CouponModel_1.CouponModel.findOne({
                code: code.trim().toUpperCase(),
            });
            return doc ? CouponMapper_1.CouponMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding coupon by code", { code, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await CouponModel_1.CouponModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking coupon existence", { id, error });
            throw error;
        }
    }
    async save(coupon) {
        try {
            const data = CouponMapper_1.CouponMapper.toPersistence(coupon);
            const doc = await CouponModel_1.CouponModel.findOneAndUpdate({ code: coupon.getCode() }, {
                ...data,
                updatedAt: new Date(),
            }, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!doc) {
                throw new Error("Failed to save coupon");
            }
            Logger_1.Logger.info("Coupon saved successfully", {
                id: doc._id.toString(),
                code: doc.code,
            });
            return CouponMapper_1.CouponMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving coupon", {
                code: coupon.getCode(),
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async findAll(options) {
        try {
            const { filters, sortBy, sortOrder, page, limit } = options;
            const query = {};
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
                    query["validFrom"]["$gte"] =
                        filters.validFromStart;
                }
                if (filters.validFromEnd) {
                    query["validFrom"]["$lte"] =
                        filters.validFromEnd;
                }
            }
            if (filters.validToStart || filters.validToEnd) {
                query["validTo"] = {};
                if (filters.validToStart) {
                    query["validTo"]["$gte"] =
                        filters.validToStart;
                }
                if (filters.validToEnd) {
                    query["validTo"]["$lte"] =
                        filters.validToEnd;
                }
            }
            const mongoSortOrder = sortOrder === "asc" ? 1 : -1;
            const skip = (page - 1) * limit;
            const [docs, total] = await Promise.all([
                CouponModel_1.CouponModel.find(query)
                    .sort({ [sortBy]: mongoSortOrder })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                CouponModel_1.CouponModel.countDocuments(query),
            ]);
            const coupons = docs.map((doc) => CouponMapper_1.CouponMapper.toDomain(doc));
            return {
                coupons,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all coupons", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
};
exports.CouponRepositoryImpl = CouponRepositoryImpl;
exports.CouponRepositoryImpl = CouponRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], CouponRepositoryImpl);
//# sourceMappingURL=CouponRepositoryImpl.js.map