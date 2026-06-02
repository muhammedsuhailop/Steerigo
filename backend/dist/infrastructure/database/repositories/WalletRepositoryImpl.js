"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const WalletModel_1 = require("../models/WalletModel");
const WalletMapper_1 = require("../mappers/WalletMapper");
const Logger_1 = require("@shared/utils/Logger");
let WalletRepositoryImpl = class WalletRepositoryImpl {
    async save(wallet) {
        try {
            const persistence = WalletMapper_1.WalletMapper.toPersistence(wallet);
            const doc = await WalletModel_1.WalletModel.findOneAndUpdate({ walletId: wallet.getId() }, persistence, {
                new: true,
                upsert: true,
                runValidators: true,
            }).exec();
            if (!doc) {
                throw new Error("Failed to save wallet");
            }
            Logger_1.Logger.info("Wallet saved", {
                walletId: doc.walletId,
                ownerId: doc.ownerId,
            });
            return WalletMapper_1.WalletMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving wallet", {
                walletId: wallet.getId(),
                error,
            });
            throw error;
        }
    }
    async findById(id) {
        try {
            const doc = await WalletModel_1.WalletModel.findOne({ walletId: id }).exec();
            return doc ? WalletMapper_1.WalletMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding wallet", { id, error });
            throw error;
        }
    }
    async findByOwner(ownerId, ownerType) {
        try {
            const doc = await WalletModel_1.WalletModel.findOne({
                ownerId,
                ownerType,
            }).exec();
            return doc ? WalletMapper_1.WalletMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding wallet by owner", {
                ownerId,
                ownerType,
                error,
            });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await WalletModel_1.WalletModel.countDocuments({
                walletId: id,
            }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking wallet existence", { id, error });
            throw error;
        }
    }
};
exports.WalletRepositoryImpl = WalletRepositoryImpl;
exports.WalletRepositoryImpl = WalletRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], WalletRepositoryImpl);
//# sourceMappingURL=WalletRepositoryImpl.js.map