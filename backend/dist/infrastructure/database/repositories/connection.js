"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = require("../../../shared/utils/Logger");
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    async connect() {
        if (this.isConnected) {
            Logger_1.Logger.info("Database already connected");
            return;
        }
        try {
            const mongoUri = process.env.MONGO_URI;
            if (!mongoUri) {
                throw new Error("MONGO_URI environment variable is not set");
            }
            await mongoose_1.default.connect(mongoUri, {
                dbName: "steerigo",
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            this.isConnected = true;
            Logger_1.Logger.info(`Connected to DB: ${mongoose_1.default.connection.db?.databaseName || "unknown"}`);
            // Handle connection events
            mongoose_1.default.connection.on("error", (error) => {
                Logger_1.Logger.error("Database connection error", error);
            });
            mongoose_1.default.connection.on("disconnected", () => {
                Logger_1.Logger.warn("Database disconnected");
                this.isConnected = false;
            });
            mongoose_1.default.connection.on("reconnected", () => {
                Logger_1.Logger.info("Database reconnected");
                this.isConnected = true;
            });
        }
        catch (error) {
            Logger_1.Logger.error("Failed to connect to database", error);
            throw error;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            Logger_1.Logger.info("Database disconnected");
        }
        catch (error) {
            Logger_1.Logger.error("Error disconnecting from database", error);
            throw error;
        }
    }
    isConnectionReady() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
}
exports.DatabaseConnection = DatabaseConnection;
//# sourceMappingURL=connection.js.map