import { DomainError } from "@domain/errors";

export class RefreshToken {
    private constructor(
        private readonly id: string,
        private readonly userId: string,
        private readonly token: string,
        private readonly expiresAt: Date,
        private isRevoked: boolean = false,
        private readonly createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ) { }

    static create(props: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
    }): RefreshToken {
        if (!props.token || props.token.trim().length === 0) {
            throw new DomainError("Refresh token cannot be empty");
        }

        if (props.expiresAt < new Date()) {
            throw new DomainError("Refresh token expiry must be in the future");
        }

        return new RefreshToken(
            props.id,
            props.userId,
            props.token,
            props.expiresAt
        );
    }

    static reconstruct(props: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
        isRevoked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }): RefreshToken {
        return new RefreshToken(
            props.id,
            props.userId,
            props.token,
            props.expiresAt,
            props.isRevoked,
            props.createdAt,
            props.updatedAt
        );
    }

    isExpired(): boolean {
        return this.expiresAt.getTime() < Date.now();
    }
    isValid(): boolean {
        return !this.isRevoked && !this.isExpired();
    }
    revoke(): void {
        if (this.isRevoked) {
            throw new DomainError("Refresh token is already revoked");
        }
        this.isRevoked = true;
        this.updatedAt = new Date();
    }
    // Getters
    getId(): string {
        return this.id;
    }
    getUserId(): string {
        return this.userId;
    }
    getToken(): string {
        return this.token;
    }
    getExpiresAt(): Date {
        return this.expiresAt;
    }
    getIsRevoked(): boolean {
        return this.isRevoked;
    }
    getCreatedAt(): Date {
        return this.createdAt;
    }
    getUpdatedAt(): Date {
        return this.updatedAt;
    }
}
