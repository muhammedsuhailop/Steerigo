"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Logger_1 = require("@shared/utils/Logger");
const connection_1 = require("@infrastructure/database/repositories/connection");
const DITypes_1 = require("@shared/constants/DITypes");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
async function bootstrap() {
    try {
        await connection_1.DatabaseConnection.getInstance().connect();
        const worker = DIContainer_1.container.get(DITypes_1.TYPES.RideRequestTimeoutWorker);
        worker.start();
        Logger_1.Logger.info("Ride search worker started successfully");
        const shutdown = async (signal) => {
            Logger_1.Logger.info(`${signal} received, shutting down worker gracefully...`);
            await worker.close();
            await connection_1.DatabaseConnection.getInstance().disconnect();
            process.exit(0);
        };
        process.on("SIGTERM", () => void shutdown("SIGTERM"));
        process.on("SIGINT", () => void shutdown("SIGINT"));
    }
    catch (error) {
        Logger_1.Logger.error("Failed to start ride search worker", { error });
        process.exit(1);
    }
}
void bootstrap();
//# sourceMappingURL=worker.js.map