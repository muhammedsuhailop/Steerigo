export declare class DatabaseConnection {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): DatabaseConnection;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnectionReady(): boolean;
}
//# sourceMappingURL=connection.d.ts.map