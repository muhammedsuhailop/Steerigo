"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const UserModel_1 = require("../models/UserModel");
const Logger_1 = require("../../../shared/utils/Logger");
const UserDomainMapper_1 = require("../mappers/UserDomainMapper");
const UserQueryService_1 = require("../services/UserQueryService");
let UserRepositoryImpl = class UserRepositoryImpl {
    constructor() {
        this.queryService = new UserQueryService_1.UserQueryService();
    }
    async findById(id) {
        const userDoc = await this.queryService.findById(id);
        return userDoc ? UserDomainMapper_1.UserDomainMapper.toDomain(userDoc) : null;
    }
    async findByEmail(email) {
        const userDoc = await this.queryService.findByEmail(email);
        return userDoc ? UserDomainMapper_1.UserDomainMapper.toDomain(userDoc) : null;
    }
    async findByEmailAndProvider(email, provider) {
        const userDoc = await this.queryService.findByEmailAndProvider(email, provider);
        return userDoc ? UserDomainMapper_1.UserDomainMapper.toDomain(userDoc) : null;
    }
    async findByGoogleId(googleId) {
        const userDoc = await this.queryService.findByGoogleId(googleId);
        return userDoc ? UserDomainMapper_1.UserDomainMapper.toDomain(userDoc) : null;
    }
    async findByMobile(mobile) {
        const userDoc = await this.queryService.findByMobile(mobile);
        return userDoc ? UserDomainMapper_1.UserDomainMapper.toDomain(userDoc) : null;
    }
    async existsByEmail(email) {
        return this.queryService.existsByEmail(email);
    }
    async existsByMobile(mobile) {
        return this.queryService.existsByMobile(mobile);
    }
    async findActiveUsers(options) {
        const userDocs = await this.queryService.findActiveUsers(options);
        return userDocs.map((doc) => UserDomainMapper_1.UserDomainMapper.toDomain(doc));
    }
    async findByRole(role, options) {
        const userDocs = await this.queryService.findByRole(role, options);
        return userDocs.map((doc) => UserDomainMapper_1.UserDomainMapper.toDomain(doc));
    }
    // Core persistence operations
    async save(user) {
        try {
            const userData = UserDomainMapper_1.UserDomainMapper.toPersistence(user);
            let savedDoc;
            const existingDoc = await UserModel_1.UserModel.findOne({
                email: user.getEmailValue(),
            });
            if (existingDoc) {
                savedDoc = await UserModel_1.UserModel.findOneAndUpdate({ email: user.getEmailValue() }, userData, { new: true });
            }
            else {
                savedDoc = await UserModel_1.UserModel.create(userData);
            }
            if (!savedDoc) {
                throw new Error("Failed to save user document");
            }
            Logger_1.Logger.info("User saved successfully", { email: user.getEmailValue() });
            return UserDomainMapper_1.UserDomainMapper.toDomain(savedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving user", { email: user.getEmailValue(), error });
            throw error;
        }
    }
    async delete(id) {
        try {
            await UserModel_1.UserModel.findByIdAndDelete(id);
            Logger_1.Logger.info("User deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting user", { id, error });
            throw error;
        }
    }
    async updateById(id, updates) {
        try {
            await UserModel_1.UserModel.findByIdAndUpdate(id, updates);
            Logger_1.Logger.info("User updated successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error updating user", { id, error });
            throw error;
        }
    }
    // Delegated query operations
    async exists(id) {
        return this.queryService.exists(id);
    }
    async existsByFilter(filters) {
        return this.queryService.existsByFilter(filters);
    }
    async findAll(options) {
        const userDocs = await this.queryService.findAll(options);
        return userDocs.map((doc) => UserDomainMapper_1.UserDomainMapper.toDomain(doc));
    }
    async findPaginated(options) {
        try {
            const limit = options.limit || 10;
            const offset = options.offset || 0;
            const page = Math.floor(offset / limit) + 1;
            const [users, total] = await Promise.all([
                this.findAll(options),
                this.queryService.count(options.filters),
            ]);
            return {
                data: users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated users", error);
            throw error;
        }
    }
    async count(filters) {
        return this.queryService.count(filters);
    }
    async updateMany(filters, updates) {
        try {
            const result = await UserModel_1.UserModel.updateMany(filters, updates);
            Logger_1.Logger.info("Users updated successfully", { filters, updates });
            return result.modifiedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error updating multiple users", {
                filters,
                updates,
                error,
            });
            throw error;
        }
    }
    async deleteMany(filters) {
        try {
            const result = await UserModel_1.UserModel.deleteMany(filters);
            Logger_1.Logger.info("Users deleted successfully", { filters });
            return result.deletedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting users", { filters, error });
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const userDocs = await UserModel_1.UserModel.find({ _id: { $in: ids } });
            return userDocs.map((doc) => UserDomainMapper_1.UserDomainMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding users by IDs", { ids, error });
            throw error;
        }
    }
    async countByUserStats(filter) {
        const query = {};
        if (filter.createdAt) {
            query.createdAt = {};
            if (filter.createdAt.from) {
                query.createdAt["$gte"] =
                    filter.createdAt.from;
            }
            if (filter.createdAt.to) {
                query.createdAt["$lte"] =
                    filter.createdAt.to;
            }
        }
        return UserModel_1.UserModel.countDocuments(query);
    }
};
exports.UserRepositoryImpl = UserRepositoryImpl;
exports.UserRepositoryImpl = UserRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], UserRepositoryImpl);
//# sourceMappingURL=UserRepositoryImpl.js.map