"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureRideRequestRepositoryImpl = void 0;
const mongoose_1 = require("mongoose");
const inversify_1 = require("inversify");
const FutureRideRequestStatus_1 = require("@domain/value-objects/FutureRideRequestStatus");
const FutureRideRequestModel_1 = require("../models/FutureRideRequestModel");
const FutureRideRequestMapper_1 = require("../mappers/FutureRideRequestMapper");
let FutureRideRequestRepositoryImpl = class FutureRideRequestRepositoryImpl {
    async findById(id) {
        const document = await FutureRideRequestModel_1.FutureRideRequestModel.findById(id);
        if (!document)
            return null;
        return FutureRideRequestMapper_1.FutureRideRequestMapper.toDomain(document);
    }
    async exists(id) {
        const result = await FutureRideRequestModel_1.FutureRideRequestModel.exists({
            _id: new mongoose_1.Types.ObjectId(id),
        });
        return Boolean(result);
    }
    async save(entity) {
        const persistence = FutureRideRequestMapper_1.FutureRideRequestMapper.toPersistence(entity);
        let savedDocument = null;
        if (entity.getId()) {
            savedDocument = await FutureRideRequestModel_1.FutureRideRequestModel.findByIdAndUpdate(entity.getId(), persistence, { new: true, runValidators: true });
        }
        else {
            savedDocument = await FutureRideRequestModel_1.FutureRideRequestModel.create(persistence);
        }
        if (!savedDocument) {
            throw new Error("Failed to save FutureRideRequest");
        }
        return FutureRideRequestMapper_1.FutureRideRequestMapper.toDomain(savedDocument);
    }
    async delete(id) {
        const result = await FutureRideRequestModel_1.FutureRideRequestModel.deleteOne({
            _id: new mongoose_1.Types.ObjectId(id),
        });
        return result.deletedCount > 0;
    }
    async findByRequestGroupId(requestGroupId) {
        const documents = await FutureRideRequestModel_1.FutureRideRequestModel.find({ requestGroupId });
        return documents.map((doc) => FutureRideRequestMapper_1.FutureRideRequestMapper.toDomain(doc));
    }
    async findByRiderId(riderId) {
        const documents = await FutureRideRequestModel_1.FutureRideRequestModel.find({ riderId }).sort({
            createdAt: -1,
        });
        return documents.map((doc) => FutureRideRequestMapper_1.FutureRideRequestMapper.toDomain(doc));
    }
    async findPendingByGroupId(requestGroupId) {
        const documents = await FutureRideRequestModel_1.FutureRideRequestModel.find({
            requestGroupId,
            status: FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING,
        });
        return documents.map((doc) => FutureRideRequestMapper_1.FutureRideRequestMapper.toDomain(doc));
    }
    async cancelAllPendingInGroup(requestGroupId) {
        const result = await FutureRideRequestModel_1.FutureRideRequestModel.updateMany({
            requestGroupId,
            status: {
                $in: [
                    FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING,
                    FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED,
                ],
            },
        }, {
            $set: {
                status: FutureRideRequestStatus_1.FutureRideRequestStatus.CANCELLED,
                updatedAt: new Date(),
            },
        });
        return result.modifiedCount;
    }
    async markExpiredAllPendingInGroup(requestGroupId) {
        const result = await FutureRideRequestModel_1.FutureRideRequestModel.updateMany({
            requestGroupId,
            status: {
                $in: [
                    FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING,
                    FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED,
                ],
            },
        }, {
            $set: {
                status: FutureRideRequestStatus_1.FutureRideRequestStatus.EXPIRED,
                updatedAt: new Date(),
            },
        });
        return result.modifiedCount;
    }
    async countByGroupAndStatus(requestGroupId, status) {
        return FutureRideRequestModel_1.FutureRideRequestModel.countDocuments({ requestGroupId, status });
    }
    async existsAcceptedInGroup(requestGroupId) {
        const result = await FutureRideRequestModel_1.FutureRideRequestModel.exists({
            requestGroupId,
            status: FutureRideRequestStatus_1.FutureRideRequestStatus.ACCEPTED,
        });
        return Boolean(result);
    }
    async findByDriverIdWithFilters(driverId, filters) {
        const query = {
            driverId: new mongoose_1.Types.ObjectId(driverId),
        };
        if (filters.status !== undefined) {
            query["status"] = filters.status;
        }
        const [documents, total] = await Promise.all([
            FutureRideRequestModel_1.FutureRideRequestModel.find(query)
                .sort({ createdAt: -1 })
                .skip(filters.offset)
                .limit(filters.limit),
            FutureRideRequestModel_1.FutureRideRequestModel.countDocuments(query),
        ]);
        const requests = documents.map((doc) => FutureRideRequestMapper_1.FutureRideRequestMapper.toDomain(doc));
        return { requests, total };
    }
    async hasAnyActiveRequestInGroup(requestGroupId) {
        const count = await FutureRideRequestModel_1.FutureRideRequestModel.countDocuments({
            requestGroupId: new mongoose_1.Types.ObjectId(requestGroupId),
            status: {
                $in: [FutureRideRequestStatus_1.FutureRideRequestStatus.PENDING, FutureRideRequestStatus_1.FutureRideRequestStatus.MATCHED],
            },
        });
        return count > 0;
    }
};
exports.FutureRideRequestRepositoryImpl = FutureRideRequestRepositoryImpl;
exports.FutureRideRequestRepositoryImpl = FutureRideRequestRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], FutureRideRequestRepositoryImpl);
//# sourceMappingURL=FutureRideRequestRepositoryImpl.js.map