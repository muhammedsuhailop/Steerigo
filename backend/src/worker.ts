import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { Logger } from "@shared/utils/Logger";
import { DatabaseConnection } from "@infrastructure/database/repositories/connection";
import { TYPES } from "@shared/constants/DITypes";
import { RideRequestTimeoutWorker } from "@infrastructure/workers/RideRequestTimeoutWorker";
import { container } from "@infrastructure/container/DIContainer";

async function bootstrap(): Promise<void> {
  try {
    await DatabaseConnection.getInstance().connect();

    const worker = container.get<RideRequestTimeoutWorker>(
      TYPES.RideRequestTimeoutWorker,
    );

    worker.start();

    Logger.info("Ride search worker started successfully");

    const shutdown = async (signal: string) => {
      Logger.info(`${signal} received, shutting down worker gracefully...`);
      await worker.close();
      await DatabaseConnection.getInstance().disconnect();
      process.exit(0);
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    Logger.error("Failed to start ride search worker", { error });
    process.exit(1);
  }
}

void bootstrap();
