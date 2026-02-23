import "reflect-metadata";
import path from "path";
import express, { Application } from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

import { DatabaseConnection } from "@infrastructure/database/repositories/connection";
import { apiRoutes } from "@interface/routes";
import {
  ErrorHandlerMiddleware,
  SecurityMiddleware,
} from "@interface/middleware";
import { Logger } from "@shared/utils/Logger";
import { initializeRideSocketServer } from "@infrastructure/realtime/socket";

class App {
  private app: Application;
  private httpServer: http.Server;
  private database: DatabaseConnection;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.database = DatabaseConnection.getInstance();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSocket();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(SecurityMiddleware.helmet());
    this.app.use(SecurityMiddleware.cors());

    // Cookie parser middleware
    this.app.use(cookieParser());

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logging
    if (process.env.NODE_ENV !== "test") {
      this.app.use(SecurityMiddleware.requestLogger);
    }

    Logger.info("Middleware initialized successfully");
  }

  private initializeRoutes(): void {
    // 1. API routes
    this.app.use("/api", apiRoutes);

    // 2. Serve React build in production
    if (process.env.NODE_ENV === "production") {
      this.app.use(
        express.static(path.join(__dirname, "..", "client", "build")),
      );
    }

    // 3. Frontend catch-all: serve index.html for non-API GET requests
    if (process.env.NODE_ENV === "production") {
      this.app.get("*", (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith("/api/")) return next();
        res.sendFile(
          path.join(__dirname, "..", "client", "build", "index.html"),
        );
      });
    }

    // 4. API-only 404 handler (must be after API and frontend handlers)
    this.app.use("/api/*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "API endpoint not found",
      });
    });

    Logger.info("Routes initialized successfully");
  }

  private initializeSocket(): void {
    const corsOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:4000", "http://localhost:5173"];

    initializeRideSocketServer(this.httpServer, corsOrigins);
    Logger.info("Socket.IO initialized successfully");
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use(ErrorHandlerMiddleware.handle);
    Logger.info("Error handling initialized successfully");
  }

  async initialize(): Promise<void> {
    try {
      // Connect to database
      await this.database.connect();
      Logger.info("Application initialized successfully");
    } catch (error) {
      Logger.error("Failed to initialize application", error);
      throw error;
    }
  }

  async start(): Promise<void> {
    try {
      await this.initialize();

      const PORT = process.env.PORT || 3000;

      this.httpServer.listen(PORT, () => {
        Logger.info(`----------------------------------------`);
        Logger.info(`Server is running on port ${PORT}`);
        Logger.info(`Environment: ${process.env.NODE_ENV}`);
        Logger.info(`API Base URL: http://localhost:${PORT}/api`);
        Logger.info(`Socket.IO URL: ws://localhost:${PORT}`);
      });

      // Handle graceful shutdown
      this.handleShutdown();
    } catch (error) {
      Logger.error("Failed to start server", error);
      process.exit(1);
    }
  }

  private handleShutdown(): void {
    const shutdown = async (signal: string): Promise<void> => {
      Logger.info(`${signal} received, shutting down gracefully...`);

      // Close HTTP server (this also closes Socket.IO connections)
      this.httpServer.close(() => {
        Logger.info("HTTP server closed");
      });

      // Disconnect database
      await this.database.disconnect();

      Logger.info("Shutdown complete");
      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("uncaughtException", (error) => {
      Logger.error("Uncaught Exception", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
      process.exit(1);
    });
  }

  getExpressApp(): Application {
    return this.app;
  }

  getHttpServer(): http.Server {
    return this.httpServer;
  }
}

// Start the application
const app = new App();
app.start();

export default app;
