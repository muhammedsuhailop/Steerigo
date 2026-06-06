import "reflect-metadata";
import { Application } from "express";
import http from "http";
declare class App {
    private app;
    private httpServer;
    private database;
    private workerSocketBridge;
    private futureRideExpiryWorker;
    private chatRoomExpiryWorker;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeSocket;
    private initializeNotificationPublisher;
    private initializeErrorHandling;
    initialize(): Promise<void>;
    start(): Promise<void>;
    private handleShutdown;
    getExpressApp(): Application;
    getHttpServer(): http.Server;
}
declare const app: App;
export default app;
//# sourceMappingURL=app.d.ts.map