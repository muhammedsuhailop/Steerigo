import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { DatabaseConnection } from '@infrastructure/database/repositories/connection';
import { apiRoutes } from '@interface/routes';
import { ErrorHandlerMiddleware, SecurityMiddleware } from '@interface/middleware';
import { Logger } from '@shared/utils/Logger';

class App {
    private app: Application;
    private database: DatabaseConnection;

    constructor() {
        this.app = express();
        this.database = DatabaseConnection.getInstance();

        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddleware(): void {
        // Security middleware
        this.app.use(SecurityMiddleware.helmet());
        this.app.use(SecurityMiddleware.cors());

        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        if (process.env.NODE_ENV !== 'test') {
            this.app.use(SecurityMiddleware.requestLogger);
        }

        Logger.info('Middleware initialized successfully');
    }

    private initializeRoutes(): void {
        // API routes
        this.app.use('/api', apiRoutes);

        // Handle 404 routes
        this.app.use('*', ErrorHandlerMiddleware.notFound);

        Logger.info('Routes initialized successfully');
    }

    private initializeErrorHandling(): void {
        // Global error handler (must be last)
        this.app.use(ErrorHandlerMiddleware.handle);

        Logger.info('Error handling initialized successfully');
    }

    async initialize(): Promise<void> {
        try {
            // Connect to database
            await this.database.connect();
            Logger.info('Application initialized successfully');
        } catch (error) {
            Logger.error('Failed to initialize application', error);
            throw error;
        }
    }

    async start(): Promise<void> {
        try {
            await this.initialize();

            const PORT = process.env.PORT || 3000;

            this.app.listen(PORT, () => {
                Logger.info(`--------------------------------------`);
                Logger.info(`Server is running on port ${PORT}`);
                Logger.info(`Environment: ${process.env.NODE_ENV}`);
                Logger.info(`API Base URL: http://localhost:${PORT}/api`);
            });

            // Handle graceful shutdown
            this.handleShutdown();

        } catch (error) {
            Logger.error('Failed to start server', error);
            process.exit(1);
        }
    }

    private handleShutdown(): void {
        process.on('SIGTERM', async () => {
            Logger.info('SIGTERM received, shutting down gracefully...');
            await this.database.disconnect();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            Logger.info('SIGINT received, shutting down gracefully...');
            await this.database.disconnect();
            process.exit(0);
        });

        process.on('uncaughtException', (error) => {
            Logger.error('Uncaught Exception', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
            process.exit(1);
        });
    }

    getExpressApp(): Application {
        return this.app;
    }
}

// Start the application
const app = new App();
app.start();

export default app;
