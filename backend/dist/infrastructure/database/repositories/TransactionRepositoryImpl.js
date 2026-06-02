"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const TransactionModel_1 = require("../models/TransactionModel");
const TransactionMapper_1 = require("../mappers/TransactionMapper");
const Logger_1 = require("@shared/utils/Logger");
const WalletModel_1 = require("../models/WalletModel");
let TransactionRepositoryImpl = class TransactionRepositoryImpl {
    async save(transaction) {
        try {
            const persistence = TransactionMapper_1.TransactionMapper.toPersistence(transaction);
            const doc = await TransactionModel_1.TransactionModel.findOneAndUpdate({ transactionId: transaction.getId() }, persistence, {
                new: true,
                upsert: true,
                runValidators: true,
            }).exec();
            if (!doc) {
                throw new Error("Failed to save transaction");
            }
            Logger_1.Logger.info("Transaction saved", {
                transactionId: doc.transactionId,
                walletId: doc.walletId,
            });
            return TransactionMapper_1.TransactionMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving transaction", {
                transactionId: transaction.getId(),
                error,
            });
            throw error;
        }
    }
    async findById(id) {
        try {
            const doc = await TransactionModel_1.TransactionModel.findOne({
                transactionId: id,
            }).exec();
            return doc ? TransactionMapper_1.TransactionMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding transaction", { id, error });
            throw error;
        }
    }
    async findByWalletId(walletId) {
        try {
            const docs = await TransactionModel_1.TransactionModel.find({ walletId })
                .sort({ createdAt: -1 })
                .exec();
            return docs.map(TransactionMapper_1.TransactionMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding wallet transactions", {
                walletId,
                error,
            });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await TransactionModel_1.TransactionModel.countDocuments({
                transactionId: id,
            }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking transaction existence", { id, error });
            throw error;
        }
    }
    async findPaginatedByWalletId(walletId, filters) {
        const query = { walletId };
        if (filters.type) {
            query["type"] = filters.type;
        }
        if (filters.direction) {
            query["direction"] = filters.direction;
        }
        if (filters.fromDate ?? filters.toDate) {
            const dateFilter = {};
            if (filters.fromDate)
                dateFilter["$gte"] = filters.fromDate;
            if (filters.toDate)
                dateFilter["$lte"] = filters.toDate;
            query["createdAt"] = dateFilter;
        }
        const sortDirection = filters.sortOrder === "asc" ? 1 : -1;
        const skip = (filters.page - 1) * filters.limit;
        const [docs, total] = await Promise.all([
            TransactionModel_1.TransactionModel.find(query)
                .sort({ createdAt: sortDirection })
                .skip(skip)
                .limit(filters.limit),
            TransactionModel_1.TransactionModel.countDocuments(query),
        ]);
        return {
            transactions: docs.map(TransactionMapper_1.TransactionMapper.toDomain),
            total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(total / filters.limit),
        };
    }
    async findByGroupId(groupId) {
        try {
            const docs = await TransactionModel_1.TransactionModel.find({ groupId })
                .sort({ createdAt: -1 })
                .exec();
            return docs.map(TransactionMapper_1.TransactionMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding transactions by groupId", {
                groupId,
                error,
            });
            throw error;
        }
    }
    async existsByGroupId(groupId) {
        try {
            const count = await TransactionModel_1.TransactionModel.countDocuments({
                groupId,
            }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking groupId existence", {
                groupId,
                error,
            });
            throw error;
        }
    }
    async findAllPaginated(filters) {
        try {
            const query = {};
            if (filters.walletId) {
                query["walletId"] = filters.walletId;
            }
            if (filters.ownerId || filters.ownerType) {
                const walletQuery = {};
                if (filters.ownerId)
                    walletQuery["ownerId"] = filters.ownerId;
                if (filters.ownerType)
                    walletQuery["ownerType"] = filters.ownerType;
                const wallets = await WalletModel_1.WalletModel.find(walletQuery)
                    .select("_id")
                    .lean();
                const walletIds = wallets.map((w) => String(w._id));
                query["walletId"] = { $in: walletIds };
            }
            if (filters.type) {
                query["type"] = filters.type;
            }
            if (filters.direction) {
                query["direction"] = filters.direction;
            }
            if (filters.relatedEntityId) {
                query["relatedEntityId"] = filters.relatedEntityId;
            }
            if (filters.relatedEntityType) {
                query["relatedEntityType"] = filters.relatedEntityType;
            }
            if (filters.fromDate || filters.toDate) {
                query["createdAt"] = {};
                if (filters.fromDate) {
                    query["createdAt"]["$gte"] =
                        filters.fromDate;
                }
                if (filters.toDate) {
                    query["createdAt"]["$lte"] = filters.toDate;
                }
            }
            const finalQuery = filters.search
                ? {
                    $and: [
                        query,
                        {
                            $or: [
                                {
                                    transactionId: {
                                        $regex: filters.search,
                                        $options: "i",
                                    },
                                },
                                {
                                    relatedEntityId: {
                                        $regex: filters.search,
                                        $options: "i",
                                    },
                                },
                                {
                                    note: {
                                        $regex: filters.search,
                                        $options: "i",
                                    },
                                },
                            ],
                        },
                    ],
                }
                : query;
            const mongoSortOrder = filters.sortOrder === "asc" ? 1 : -1;
            const sortField = filters.sortBy === "amount" ? "amount.amount" : "createdAt";
            const skip = (filters.page - 1) * filters.limit;
            const [docs, total] = await Promise.all([
                TransactionModel_1.TransactionModel.find(finalQuery)
                    .sort({ [sortField]: mongoSortOrder })
                    .skip(skip)
                    .limit(filters.limit)
                    .lean(),
                TransactionModel_1.TransactionModel.countDocuments(finalQuery),
            ]);
            return {
                transactions: docs.map((doc) => TransactionMapper_1.TransactionMapper.toDomain(doc)),
                total,
                page: filters.page,
                limit: filters.limit,
                totalPages: Math.ceil(total / filters.limit),
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error in findAllPaginated transactions", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
};
exports.TransactionRepositoryImpl = TransactionRepositoryImpl;
exports.TransactionRepositoryImpl = TransactionRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], TransactionRepositoryImpl);
//# sourceMappingURL=TransactionRepositoryImpl.js.map