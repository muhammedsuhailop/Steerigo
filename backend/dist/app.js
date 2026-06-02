"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Load environment variables
dotenv_1.default.config();
const connection_1 = require("@infrastructure/database/repositories/connection");
const routes_1 = require("@interface/routes");
const middleware_1 = require("@interface/middleware");
const Logger_1 = require("@shared/utils/Logger");
const socket_1 = require("@infrastructure/realtime/socket");
const services_1 = require("@infrastructure/services");
const NotificationFactory_1 = require("@infrastructure/container/factories/NotificationFactory");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.httpServer = http_1.default.createServer(this.app);
        this.database = connection_1.DatabaseConnection.getInstance();
        this.workerSocketBridge = DIContainer_1.container.get(DITypes_1.TYPES.WorkerSocketBridge);
        this.futureRideExpiryWorker = DIContainer_1.container.get(DITypes_1.TYPES.FutureRideExpiryWorker);
        this.chatRoomExpiryWorker = DIContainer_1.container.get(DITypes_1.TYPES.ChatRoomExpiryWorker);
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        // Security middleware
        this.app.use(middleware_1.SecurityMiddleware.helmet());
        this.app.use(middleware_1.SecurityMiddleware.cors());
        // Cookie parser middleware
        this.app.use((0, cookie_parser_1.default)());
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
        // Request logging
        if (process.env.NODE_ENV !== "test") {
            this.app.use(middleware_1.SecurityMiddleware.requestLogger);
        }
        Logger_1.Logger.info("Middleware initialized successfully");
    }
    initializeRoutes() {
        // 1. API routes
        this.app.use("/api", routes_1.apiRoutes);
        // 2. Serve React build in production
        if (process.env.NODE_ENV === "production") {
            this.app.use(express_1.default.static(path_1.default.join(__dirname, "..", "client", "build")));
        }
        // 3. Frontend catch-all: serve index.html for non-API GET requests
        if (process.env.NODE_ENV === "production") {
            this.app.get("*", (req, res, next) => {
                // Skip API routes
                if (req.path.startsWith("/api/"))
                    return next();
                res.sendFile(path_1.default.join(__dirname, "..", "client", "build", "index.html"));
            });
        }
        // 4. API-only 404 handler (must be after API and frontend handlers)
        this.app.use("/api/*", (req, res) => {
            res.status(404).json({
                success: false,
                message: "API endpoint not found",
            });
        });
        Logger_1.Logger.info("Routes initialized successfully");
    }
    async initializeSocket() {
        const corsOrigins = process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(",")
            : ["http://localhost:4000", "http://localhost:5173"];
        const tokenService = new services_1.TokenService();
        (0, socket_1.initializeRideSocketServer)(this.httpServer, corsOrigins, tokenService);
        this.futureRideExpiryWorker.start();
        Logger_1.Logger.info("Future ride expiry worker started successfully");
        this.chatRoomExpiryWorker.start();
        Logger_1.Logger.info("Chat room expiry worker started successfully");
        // Start Redis bridge — subscribes to worker events and forwards to Socket.IO
        await this.workerSocketBridge.start();
        Logger_1.Logger.info("Socket.IO and WorkerSocketBridge initialized successfully");
    }
    initializeNotificationPublisher() {
        NotificationFactory_1.NotificationFactory.registerRealtimePublisher(DIContainer_1.container);
        Logger_1.Logger.info("Notification realtime publisher registered");
    }
    initializeErrorHandling() {
        this.app.use(middleware_1.ErrorHandlerMiddleware.handle);
        Logger_1.Logger.info("Error handling initialized successfully");
    }
    async initialize() {
        try {
            await this.database.connect();
            Logger_1.Logger.info("Application initialized successfully");
        }
        catch (error) {
            Logger_1.Logger.error("Failed to initialize application", error);
            throw error;
        }
    }
    async start() {
        try {
            await this.initialize();
            await this.initializeSocket();
            this.initializeNotificationPublisher();
            const PORT = process.env.PORT || 3000;
            this.httpServer.listen(PORT, () => {
                Logger_1.Logger.info(`----------------------------------------`);
                Logger_1.Logger.info(`Server is running on port ${PORT}`);
                Logger_1.Logger.info(`Environment: ${process.env.NODE_ENV}`);
                Logger_1.Logger.info(`API Base URL: http://localhost:${PORT}/api`);
                Logger_1.Logger.info(`Socket.IO URL: ws://localhost:${PORT}`);
            });
            this.handleShutdown();
        }
        catch (error) {
            Logger_1.Logger.error("Failed to start server", error);
            process.exit(1);
        }
    }
    handleShutdown() {
        const shutdown = async (signal) => {
            Logger_1.Logger.info(`${signal} received, shutting down gracefully...`);
            // Close HTTP server (this also closes Socket.IO connections)
            this.httpServer.close(() => {
                Logger_1.Logger.info("HTTP server closed");
            });
            await this.workerSocketBridge.stop();
            await this.futureRideExpiryWorker.close();
            await this.chatRoomExpiryWorker.close();
            await this.database.disconnect();
            Logger_1.Logger.info("Shutdown complete");
            process.exit(0);
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("uncaughtException", (error) => {
            Logger_1.Logger.error("Uncaught Exception", error);
            process.exit(1);
        });
        process.on("unhandledRejection", (reason, promise) => {
            Logger_1.Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
            process.exit(1);
        });
    }
    getExpressApp() {
        return this.app;
    }
    getHttpServer() {
        return this.httpServer;
    }
}
// Start the application
const app = new App();
app.start();
exports.default = app;
//# sourceMappingURL=app.js.map