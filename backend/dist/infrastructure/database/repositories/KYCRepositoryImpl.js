"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const KYCModel_1 = require("../models/KYCModel");
const KYCMapper_1 = require("../mappers/KYCMapper");
const KYCStatus_1 = require("@domain/value-objects/KYCStatus");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
let KYCRepositoryImpl = class KYCRepositoryImpl {
    //   Basic Repository Operations
    async findById(id) {
        try {
            const kycDoc = await KYCModel_1.KYCModel.findById(id);
            return kycDoc ? KYCMapper_1.KYCMapper.toDomain(kycDoc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding KYC by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await KYCModel_1.KYCModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking KYC existence", { id, error });
            throw error;
        }
    }
    async save(kyc) {
        try {
            const kycData = KYCMapper_1.KYCMapper.toPersistence(kyc);
            const savedDoc = await KYCModel_1.KYCModel.findByIdAndUpdate(kyc.getId(), kycData, {
                upsert: true,
                new: true,
            });
            return KYCMapper_1.KYCMapper.toDomain(savedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving KYC", { kycId: kyc.getId(), error });
            throw error;
        }
    }
    async delete(id) {
        try {
            await KYCModel_1.KYCModel.findByIdAndDelete(id);
            Logger_1.Logger.info("KYC deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting KYC", { id, error });
            throw error;
        }
    }
    //   Query Operations
    async findAll(options) {
        try {
            const query = KYCModel_1.KYCModel.find();
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const kycs = await query.exec();
            return kycs.map(KYCMapper_1.KYCMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all KYCs", { error });
            throw error;
        }
    }
    async count(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters ?? {});
            return await KYCModel_1.KYCModel.countDocuments(mongoFilter);
        }
        catch (error) {
            Logger_1.Logger.error("Error counting KYCs", { error });
            throw error;
        }
    }
    async existsByFilter(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters);
            return (await KYCModel_1.KYCModel.countDocuments(mongoFilter)) > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking KYC existence by filter", {
                filters,
                error,
            });
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const docs = await KYCModel_1.KYCModel.find({ _id: { $in: ids } });
            return docs.map(KYCMapper_1.KYCMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding KYCs by ids", { ids, error });
            throw error;
        }
    }
    async findPaginated(options) {
        try {
            const { page = 1, limit = 10, filters = {}, sortBy = "createdAt", sortOrder = "desc", } = options;
            const mongoFilter = this.buildFilterQuery(filters);
            const sortValue = {
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            };
            const total = await KYCModel_1.KYCModel.countDocuments(mongoFilter);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await KYCModel_1.KYCModel.find(mongoFilter)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(KYCMapper_1.KYCMapper.toDomain);
            return { data, total, page, limit, totalPages };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated KYCs", { options, error });
            throw error;
        }
    }
    //   Batch Operations
    async updateMany(filters, updates) {
        try {
            const updateData = {};
            const u = updates;
            if (typeof u === "object" &&
                u !== null &&
                typeof u
                    .getVerificationStatus === "function") {
                updateData.verificationStatus = u.getVerificationStatus();
            }
            if (typeof u === "object" &&
                u !== null &&
                typeof u.getDocType ===
                    "function") {
                updateData.docType = u.getDocType();
            }
            if (typeof u === "object" &&
                u !== null &&
                typeof u
                    .getDocImageUrlsFront === "function") {
                updateData.documentUrl = (updateData.documentUrl ?? []).concat(u.getDocImageUrlsFront());
            }
            if (typeof u === "object" &&
                u !== null &&
                typeof u
                    .getDocImageUrlsBack === "function") {
                updateData.documentUrl = (updateData.documentUrl ?? []).concat(u.getDocImageUrlsBack());
            }
            if (typeof u === "object" &&
                u !== null &&
                typeof u.getExpiryDate ===
                    "function") {
                updateData.expiryDate = u.getExpiryDate();
            }
            if (typeof u === "object" &&
                u !== null &&
                typeof u.getComments === "function") {
                updateData.verificationNotes = u.getComments();
            }
            updateData.updatedAt = new Date();
            const mongoFilter = this.buildFilterQuery(filters);
            const result = await KYCModel_1.KYCModel.updateMany(mongoFilter, {
                $set: updateData,
            });
            Logger_1.Logger.info("Multiple KYCs updated", {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            });
            return result.modifiedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error updating multiple KYCs", {
                filters,
                updates,
                error,
            });
            throw error;
        }
    }
    async deleteMany(filters) {
        try {
            const result = await KYCModel_1.KYCModel.deleteMany(filters);
            Logger_1.Logger.info("Multiple KYCs deleted", { count: result.deletedCount });
            return result.deletedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting multiple KYCs", { filters, error });
            throw error;
        }
    }
    //   KYC-Specific Operations
    async findByDriverId(driverId) {
        try {
            const kycs = await KYCModel_1.KYCModel.find({ driverId }).sort({ createdAt: -1 });
            return kycs.map(KYCMapper_1.KYCMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding KYCs by driverId", { driverId, error });
            throw error;
        }
    }
    async findByDriverAndDocType(driverId, docType) {
        try {
            const kycDoc = await KYCModel_1.KYCModel.findOne({ driverId, docType });
            return kycDoc ? KYCMapper_1.KYCMapper.toDomain(kycDoc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding KYC by driver and doc type", {
                driverId,
                docType,
                error,
            });
            throw error;
        }
    }
    // Admin interface method
    async findByDriverIdAndDocType(driverId, docType) {
        return this.findByDriverAndDocType(driverId, docType);
    }
    async findByStatus(status, options) {
        try {
            const query = KYCModel_1.KYCModel.find({ verificationStatus: status });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const kycs = await query.exec();
            return kycs.map(KYCMapper_1.KYCMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding KYCs by status", { status, error });
            throw error;
        }
    }
    async findPendingRequests(options) {
        return this.findByStatus(KYCStatus_1.KYCStatus.IN_REVIEW, options);
    }
    async existsByDriverAndDocType(driverId, docType) {
        try {
            const count = await KYCModel_1.KYCModel.countDocuments({ driverId, docType });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking KYC existence", {
                driverId,
                docType,
                error,
            });
            throw error;
        }
    }
    async countByStatus(status) {
        try {
            return await KYCModel_1.KYCModel.countDocuments({ verificationStatus: status });
        }
        catch (error) {
            Logger_1.Logger.error("Error counting KYCs by status", { status, error });
            throw error;
        }
    }
    async findExpiredDocuments() {
        try {
            const now = new Date();
            const kycs = await KYCModel_1.KYCModel.find({
                expiryDate: { $lt: now },
                verificationStatus: KYCStatus_1.KYCStatus.APPROVED,
            });
            return kycs.map(KYCMapper_1.KYCMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding expired KYC documents", { error });
            throw error;
        }
    }
    //   Admin-Specific Operations
    async findKYCDocumentsWithDriverInfo(filters, pagination) {
        const mongoFilter = this.buildFilterQuery(filters);
        const totalItems = await KYCModel_1.KYCModel.countDocuments(mongoFilter);
        const totalPages = Math.ceil(totalItems / pagination.pageSize);
        const skip = (pagination.page - 1) * pagination.pageSize;
        const pipeline = [
            { $match: mongoFilter },
            {
                $lookup: {
                    from: "drivers",
                    localField: "driverId",
                    foreignField: "_id",
                    as: "driver",
                },
            },
            { $unwind: "$driver" },
            {
                $lookup: {
                    from: "users",
                    localField: "driver.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    driverId: 1,
                    docType: 1,
                    docNumber: 1,
                    issueDate: 1,
                    expiryDate: 1,
                    verificationStatus: 1,
                    comments: 1,
                    docImageUrlsFront: 1,
                    docImageUrlsBack: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "driver._id": 1,
                    "driver.status": 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.email": 1,
                    "user.mobile": 1,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: pagination.pageSize },
        ];
        const results = (await KYCModel_1.KYCModel.aggregate(pipeline));
        return {
            data: results.map((r) => {
                const kycDocForMapper = {
                    _id: r._id,
                    driverId: r.driverId,
                    docType: r.docType,
                    docNumber: r.docNumber,
                    issueDate: r.issueDate,
                    expiryDate: r.expiryDate,
                    verificationStatus: r.verificationStatus,
                    comments: r.comments,
                    createdAt: r.createdAt,
                    docImageUrlsFront: r.docImageUrlsFront ?? [],
                    docImageUrlsBack: r.docImageUrlsBack ?? [],
                    updatedAt: r.updatedAt,
                };
                return {
                    kycDocument: KYCMapper_1.KYCMapper.toDomain(kycDocForMapper),
                    driverInfo: {
                        driverId: String(r.driver?._id),
                        userId: String(r.user?._id),
                        userName: r.user?.name ?? "",
                        userEmail: r.user?.email ?? "",
                        userMobile: r.user?.mobile ?? "",
                        driverStatus: r.driver?.status,
                    },
                };
            }),
            pagination: {
                currentPage: pagination.page,
                pageSize: pagination.pageSize,
                totalItems,
                totalPages,
            },
        };
    }
    async updateVerificationStatus(kycId, status, comments) {
        const update = {
            verificationStatus: status,
            updatedAt: new Date(),
        };
        if (comments)
            update.verificationNotes = comments;
        const res = await KYCModel_1.KYCModel.updateOne({ _id: kycId }, update);
        return res.modifiedCount > 0;
    }
    async findKYCWithDriverInfo(kycId) {
        const objectId = new mongoose_1.Types.ObjectId(kycId);
        const pipeline = [
            { $match: { _id: objectId } },
            {
                $lookup: {
                    from: "drivers",
                    localField: "driverId",
                    foreignField: "_id",
                    as: "driver",
                },
            },
            { $unwind: "$driver" },
            {
                $lookup: {
                    from: "users",
                    localField: "driver.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    driverId: 1,
                    docType: 1,
                    docNumber: 1,
                    issueDate: 1,
                    expiryDate: 1,
                    verificationStatus: 1,
                    comments: 1,
                    docImageUrlsFront: 1,
                    docImageUrlsBack: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "driver._id": 1,
                    "driver.status": 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.email": 1,
                    "user.mobile": 1,
                },
            },
        ];
        const [result] = (await KYCModel_1.KYCModel.aggregate(pipeline));
        if (!result)
            return null;
        const kycDocForMapper = {
            _id: result._id,
            driverId: result.driverId,
            docType: result.docType,
            docNumber: result.docNumber,
            issueDate: result.issueDate,
            expiryDate: result.expiryDate,
            verificationStatus: result.verificationStatus,
            comments: result.comments,
            docImageUrlsFront: result.docImageUrlsFront ?? [],
            docImageUrlsBack: result.docImageUrlsBack ?? [],
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
        return {
            kycDocument: KYCMapper_1.KYCMapper.toDomain(kycDocForMapper),
            driverInfo: {
                driverId: String(result.driver?._id),
                userId: String(result.user?._id),
                userName: result.user?.name ?? "",
                userEmail: result.user?.email ?? "",
                userMobile: result.user?.mobile ?? "",
                driverStatus: result.driver?.status ?? "",
            },
        };
    }
    //   Private Helper Methods
    buildFilterQuery(filters) {
        const q = {};
        if ("verificationStatus" in filters &&
            typeof filters.verificationStatus === "string") {
            q.verificationStatus = filters.verificationStatus;
        }
        if ("docType" in filters && typeof filters.docType === "string") {
            q.docType = filters.docType;
        }
        if ("driverId" in filters && typeof filters.driverId === "string") {
            q.driverId = filters.driverId;
        }
        if ("dateFrom" in filters || "dateTo" in filters) {
            const d = {};
            if ("dateFrom" in filters && filters.dateFrom instanceof Date) {
                d.$gte = filters.dateFrom;
            }
            if ("dateTo" in filters && filters.dateTo instanceof Date) {
                d.$lte = filters.dateTo;
            }
            if (Object.keys(d).length) {
                q.createdAt = d;
            }
        }
        return q;
    }
};
exports.KYCRepositoryImpl = KYCRepositoryImpl;
exports.KYCRepositoryImpl = KYCRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], KYCRepositoryImpl);
//# sourceMappingURL=KYCRepositoryImpl.js.map