"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestGroupRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const RideRequestGroupModel_1 = require("../models/RideRequestGroupModel");
const RideRequestGroupMapper_1 = require("../mappers/RideRequestGroupMapper");
const RideRequestGroupStatus_1 = require("@domain/value-objects/RideRequestGroupStatus");
const Logger_1 = require("@shared/utils/Logger");
let RideRequestGroupRepositoryImpl = class RideRequestGroupRepositoryImpl {
    async save(entity) {
        const persistence = RideRequestGroupMapper_1.RideRequestGroupMapper.toPersistence(entity);
        const filter = entity.getId()
            ? { _id: new mongoose_1.Types.ObjectId(entity.getId()) }
            : {};
        const doc = await RideRequestGroupModel_1.RideRequestGroupModel.findOneAndUpdate(filter, { $set: persistence }, { new: true, upsert: true, setDefaultsOnInsert: true }).exec();
        if (!doc) {
            throw new Error("Failed to save RideRequestGroup");
        }
        return RideRequestGroupMapper_1.RideRequestGroupMapper.toDomain(doc);
    }
    async exists(id) {
        try {
            const count = await RideRequestGroupModel_1.RideRequestGroupModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking rideGroup checking", { id, error });
            throw error;
        }
    }
    async findById(id) {
        const doc = await RideRequestGroupModel_1.RideRequestGroupModel.findById(id).exec();
        if (!doc) {
            return null;
        }
        return RideRequestGroupMapper_1.RideRequestGroupMapper.toDomain(doc);
    }
    async findActiveById(id) {
        const doc = await RideRequestGroupModel_1.RideRequestGroupModel.findOne({
            _id: new mongoose_1.Types.ObjectId(id),
            status: RideRequestGroupStatus_1.RideRequestGroupStatus.SEARCHING,
        }).exec();
        if (!doc) {
            return null;
        }
        return RideRequestGroupMapper_1.RideRequestGroupMapper.toDomain(doc);
    }
    async delete(id) {
        const result = await RideRequestGroupModel_1.RideRequestGroupModel.deleteOne({
            _id: new mongoose_1.Types.ObjectId(id),
        }).exec();
        return result.deletedCount === 1;
    }
    async updateCurrentIndex(id, newIndex) {
        const doc = await RideRequestGroupModel_1.RideRequestGroupModel.findOneAndUpdate({
            _id: new mongoose_1.Types.ObjectId(id),
            status: RideRequestGroupStatus_1.RideRequestGroupStatus.SEARCHING,
        }, {
            $set: {
                currentIndex: newIndex,
                updatedAt: new Date(),
            },
        }, { new: true }).exec();
        return doc ? RideRequestGroupMapper_1.RideRequestGroupMapper.toDomain(doc) : null;
    }
    async updateStatus(id, status) {
        const doc = await RideRequestGroupModel_1.RideRequestGroupModel.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id) }, {
            $set: {
                status,
                updatedAt: new Date(),
            },
        }, { new: true }).exec();
        return doc ? RideRequestGroupMapper_1.RideRequestGroupMapper.toDomain(doc) : null;
    }
};
exports.RideRequestGroupRepositoryImpl = RideRequestGroupRepositoryImpl;
exports.RideRequestGroupRepositoryImpl = RideRequestGroupRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], RideRequestGroupRepositoryImpl);
//# sourceMappingURL=RideRequestGroupRepositoryImpl.js.map