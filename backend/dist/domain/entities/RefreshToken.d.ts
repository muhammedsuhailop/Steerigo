export declare class RefreshToken {
    private readonly id;
    private readonly userId;
    private readonly token;
    private readonly expiresAt;
    private isRevoked;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(props: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
    }): RefreshToken;
    static reconstruct(props: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
        isRevoked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }): RefreshToken;
    isExpired(): boolean;
    isValid(): boolean;
    revoke(): void;
    getId(): string;
    getUserId(): string;
    getToken(): string;
    getExpiresAt(): Date;
    getIsRevoked(): boolean;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}
//# sourceMappingURL=RefreshToken.d.ts.map