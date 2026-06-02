"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQueryService = void 0;
const UserModel_1 = require("../models/UserModel");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const Logger_1 = require("../../../shared/utils/Logger");
class UserQueryService {
    async findById(id) {
        try {
            return await UserModel_1.UserModel.findById(id);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user by ID", { id, error });
            throw error;
        }
    }
    async findByEmail(email) {
        try {
            return await UserModel_1.UserModel.findOne({
                email: email.toLowerCase().trim(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user by email", { email, error });
            throw error;
        }
    }
    async findByEmailAndProvider(email, provider) {
        try {
            return await UserModel_1.UserModel.findOne({
                email: email.toLowerCase().trim(),
                authProvider: provider,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user by email and provider", {
                email,
                provider,
                error,
            });
            throw error;
        }
    }
    async findByGoogleId(googleId) {
        try {
            return await UserModel_1.UserModel.findOne({ googleId });
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user by Google ID", { googleId, error });
            throw error;
        }
    }
    async findByMobile(mobile) {
        try {
            return await UserModel_1.UserModel.findOne({ mobile: mobile.trim() });
        }
        catch (error) {
            Logger_1.Logger.error("Error finding user by mobile", { mobile, error });
            throw error;
        }
    }
    async findAll(options) {
        try {
            let query = UserModel_1.UserModel.find(options?.filters || {});
            if (options?.limit)
                query = query.limit(options.limit);
            if (options?.offset)
                query = query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query = query.sort({ [options.sortBy]: sortOrder });
            }
            return await query.exec();
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all users", error);
            throw error;
        }
    }
    async findActiveUsers(options) {
        const activeFilters = {
            ...options?.filters,
            status: AuthConstants_1.UserStatus.ACTIVE,
            isVerified: true,
        };
        return this.findAll({ ...options, filters: activeFilters });
    }
    async findByRole(role, options) {
        const roleFilters = {
            ...options?.filters,
            role,
        };
        return this.findAll({ ...options, filters: roleFilters });
    }
    async count(filters) {
        try {
            return await UserModel_1.UserModel.countDocuments(filters || {});
        }
        catch (error) {
            Logger_1.Logger.error("Error counting users", error);
            throw error;
        }
    }
    async existsByEmail(email) {
        try {
            const count = await UserModel_1.UserModel.countDocuments({
                email: email.toLowerCase().trim(),
            });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking if email exists", { email, error });
            throw error;
        }
    }
    async existsByMobile(mobile) {
        try {
            const count = await UserModel_1.UserModel.countDocuments({
                mobile: mobile.trim(),
            });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking if mobile exists", { mobile, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await UserModel_1.UserModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking if user exists", { id, error });
            throw error;
        }
    }
    async existsByFilter(filters) {
        try {
            const count = await UserModel_1.UserModel.countDocuments(filters);
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking existence by filter", { filters, error });
            throw error;
        }
    }
}
exports.UserQueryService = UserQueryService;
//# sourceMappingURL=UserQueryService.js.map