"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareConfigurationRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const FareConfigurationModel_1 = require("../models/FareConfigurationModel");
const FareConfigurationMapper_1 = require("../mappers/FareConfigurationMapper");
const Logger_1 = require("@shared/utils/Logger");
let FareConfigurationRepositoryImpl = class FareConfigurationRepositoryImpl {
    async findById(id) {
        try {
            const doc = await FareConfigurationModel_1.FareConfigurationModel.findById(id);
            return doc ? FareConfigurationMapper_1.FareConfigurationMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding fare configuration by id", { id, error });
            throw error;
        }
    }
    async findActiveConfiguration(date = new Date()) {
        try {
            const doc = await FareConfigurationModel_1.FareConfigurationModel.findOne({
                isActive: true,
                effectiveFrom: { $lte: date },
                $or: [{ effectiveTill: null }, { effectiveTill: { $gte: date } }],
            }).sort({ effectiveFrom: -1 });
            return doc ? FareConfigurationMapper_1.FareConfigurationMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding active fare configuration", { date, error });
            throw error;
        }
    }
    async save(configuration) {
        try {
            const configId = configuration.getId();
            const configData = FareConfigurationMapper_1.FareConfigurationMapper.toPersistence(configuration);
            const savedDoc = await FareConfigurationModel_1.FareConfigurationModel.findByIdAndUpdate(configId, configData, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!savedDoc) {
                throw new Error(`Failed to save fare configuration: ${configId}`);
            }
            Logger_1.Logger.info("Fare configuration saved successfully", {
                configId,
                baseAmount: configuration.getBaseAmount(),
            });
            return FareConfigurationMapper_1.FareConfigurationMapper.toDomain(savedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving fare configuration", {
                configId: configuration.getId(),
                error,
            });
            throw error;
        }
    }
    async findAll() {
        try {
            const docs = await FareConfigurationModel_1.FareConfigurationModel.find().sort({
                effectiveFrom: -1,
            });
            return docs.map(FareConfigurationMapper_1.FareConfigurationMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all fare configurations", { error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await FareConfigurationModel_1.FareConfigurationModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking fare configuration existence", {
                id,
                error,
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await FareConfigurationModel_1.FareConfigurationModel.findByIdAndDelete(id);
            Logger_1.Logger.info("Fare configuration deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting fare configuration", { id, error });
            throw error;
        }
    }
    async deactivateConfiguration(id) {
        try {
            await FareConfigurationModel_1.FareConfigurationModel.findByIdAndUpdate(id, {
                $set: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            });
            Logger_1.Logger.info("Fare configuration deactivated", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deactivating fare configuration", { id, error });
            throw error;
        }
    }
    async findHistoricalConfigurations() {
        try {
            const docs = await FareConfigurationModel_1.FareConfigurationModel.find({
                isActive: false,
            }).sort({ effectiveFrom: -1 });
            return docs.map(FareConfigurationMapper_1.FareConfigurationMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding historical fare configurations", { error });
            throw error;
        }
    }
};
exports.FareConfigurationRepositoryImpl = FareConfigurationRepositoryImpl;
exports.FareConfigurationRepositoryImpl = FareConfigurationRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], FareConfigurationRepositoryImpl);
//# sourceMappingURL=FareConfigurationRepositoryImpl.js.map