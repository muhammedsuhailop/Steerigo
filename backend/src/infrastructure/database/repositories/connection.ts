import mongoose from "mongoose";
import { Logger } from "@shared/utils/Logger";

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      Logger.info("Database already connected");
      return;
    }

    try {
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not set");
      }

      await mongoose.connect(mongoUri, {
        dbName: "steerigo",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      Logger.info(
        `Connected to DB: ${mongoose.connection.db?.databaseName || "unknown"}`
      );

      // Handle connection events
      mongoose.connection.on("error", (error) => {
        Logger.error("Database connection error", error);
      });

      mongoose.connection.on("disconnected", () => {
        Logger.warn("Database disconnected");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        Logger.info("Database reconnected");
        this.isConnected = true;
      });
    } catch (error) {
      Logger.error("Failed to connect to database", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      Logger.info("Database disconnected");
    } catch (error) {
      Logger.error("Error disconnecting from database", error);
      throw error;
    }
  }

  isConnectionReady(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}
