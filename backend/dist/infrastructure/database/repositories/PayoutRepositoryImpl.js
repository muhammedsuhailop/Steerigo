"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const PayoutModel_1 = require("../models/PayoutModel");
const PayoutMapper_1 = require("../mappers/PayoutMapper");
const Logger_1 = require("@shared/utils/Logger");
const PayoutStatus_1 = require("@domain/value-objects/PayoutStatus");
let PayoutRepositoryImpl = class PayoutRepositoryImpl {
    async save(payout) {
        try {
            const persistence = PayoutMapper_1.PayoutMapper.toPersistence(payout);
            const doc = await PayoutModel_1.PayoutModel.findOneAndUpdate({ payoutId: payout.getId() }, persistence, {
                new: true,
                upsert: true,
                runValidators: true,
            }).exec();
            if (!doc) {
                throw new Error("Failed to save payout");
            }
            Logger_1.Logger.info("Payout saved", {
                payoutId: doc.payoutId,
                driverId: doc.driverId,
                status: doc.status,
            });
            return PayoutMapper_1.PayoutMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving payout", {
                payoutId: payout.getId(),
                error,
            });
            throw error;
        }
    }
    async findById(id) {
        try {
            const doc = await PayoutModel_1.PayoutModel.findOne({ payoutId: id }).exec();
            return doc ? PayoutMapper_1.PayoutMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding payout", { id, error });
            throw error;
        }
    }
    async findByDriverId(driverId) {
        try {
            const docs = await PayoutModel_1.PayoutModel.find({ driverId })
                .sort({ createdAt: -1 })
                .exec();
            return docs.map(PayoutMapper_1.PayoutMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding driver payouts", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await PayoutModel_1.PayoutModel.countDocuments({
                payoutId: id,
            }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking payout existence", { id, error });
            throw error;
        }
    }
    async findPendingByDriverId(driverId) {
        const doc = await PayoutModel_1.PayoutModel.findOne({
            driverId,
            status: PayoutStatus_1.PayoutStatus.REQUESTED,
        });
        return doc ? PayoutMapper_1.PayoutMapper.toDomain(doc) : null;
    }
    async findAllWithFilters(filters) {
        const query = {};
        if (filters.status)
            query["status"] = filters.status;
        if (filters.driverId)
            query["driverId"] = filters.driverId;
        const sortField = filters.sortBy === "amount" ? "amount.value" : "createdAt";
        const sortDirection = filters.sortOrder === "asc" ? 1 : -1;
        const skip = (filters.page - 1) * filters.limit;
        const [docs, total] = await Promise.all([
            PayoutModel_1.PayoutModel.find(query)
                .sort({ [sortField]: sortDirection })
                .skip(skip)
                .limit(filters.limit),
            PayoutModel_1.PayoutModel.countDocuments(query),
        ]);
        return {
            payouts: docs.map(PayoutMapper_1.PayoutMapper.toDomain),
            total,
            page: filters.page,
            limit: filters.limit,
        };
    }
};
exports.PayoutRepositoryImpl = PayoutRepositoryImpl;
exports.PayoutRepositoryImpl = PayoutRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], PayoutRepositoryImpl);
//# sourceMappingURL=PayoutRepositoryImpl.js.map