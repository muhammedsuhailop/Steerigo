"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const PaymentModel_1 = require("../models/PaymentModel");
const PaymentMapper_1 = require("../mappers/PaymentMapper");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
const PaymentStatus_1 = require("@domain/value-objects/PaymentStatus");
let PaymentRepositoryImpl = class PaymentRepositoryImpl {
    async findById(id) {
        try {
            const doc = await PaymentModel_1.PaymentModel.findOne({ paymentId: id }).exec();
            return doc ? PaymentMapper_1.PaymentMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding payment by id", { id, error });
            throw error;
        }
    }
    async findByRideId(rideId) {
        try {
            const doc = await PaymentModel_1.PaymentModel.findOne({ rideId }).exec();
            return doc ? PaymentMapper_1.PaymentMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding payment by rideId", { rideId, error });
            throw error;
        }
    }
    async findByRiderId(riderId) {
        try {
            const docs = await PaymentModel_1.PaymentModel.find({
                riderId: new mongoose_1.Types.ObjectId(riderId),
            })
                .sort({ createdAt: -1 })
                .exec();
            return docs.map(PaymentMapper_1.PaymentMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding payments by riderId", { riderId, error });
            throw error;
        }
    }
    async save(payment) {
        try {
            const persistence = PaymentMapper_1.PaymentMapper.toPersistence(payment);
            const doc = await PaymentModel_1.PaymentModel.findOneAndUpdate({ paymentId: payment.getId() }, {
                ...persistence,
                updatedAt: new Date(),
            }, {
                new: true,
                runValidators: true,
                upsert: true,
            }).exec();
            if (!doc) {
                throw new Error(`Failed to save payment ${payment.getId()}`);
            }
            Logger_1.Logger.info("Payment saved/updated", {
                paymentId: doc.paymentId,
                rideId: doc.rideId,
                status: doc.status,
            });
            return PaymentMapper_1.PaymentMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving payment", {
                paymentId: payment.getId(),
                error,
            });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await PaymentModel_1.PaymentModel.countDocuments({ paymentId: id }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking payment existence", { id, error });
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await PaymentModel_1.PaymentModel.findOneAndDelete({
                paymentId: id,
            }).exec();
            if (result) {
                Logger_1.Logger.info("Payment deleted", { paymentId: id });
            }
            else {
                Logger_1.Logger.warn("Payment not found for deletion", { paymentId: id });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting payment", { paymentId: id, error });
            throw error;
        }
    }
    async findSuccessfulByRideId(rideId) {
        try {
            const doc = await PaymentModel_1.PaymentModel.findOne({
                rideId,
                status: PaymentStatus_1.PaymentStatus.SUCCESS,
            }).exec();
            return doc ? PaymentMapper_1.PaymentMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding successful payment by rideId", {
                rideId,
                error,
            });
            throw error;
        }
    }
};
exports.PaymentRepositoryImpl = PaymentRepositoryImpl;
exports.PaymentRepositoryImpl = PaymentRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], PaymentRepositoryImpl);
//# sourceMappingURL=PaymentRepositoryImpl.js.map