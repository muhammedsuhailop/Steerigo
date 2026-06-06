"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const errors_1 = require("../errors");
class RefreshToken {
    constructor(id, userId, token, expiresAt, isRevoked = false, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.isRevoked = isRevoked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(props) {
        if (!props.token || props.token.trim().length === 0) {
            throw new errors_1.DomainError("Refresh token cannot be empty");
        }
        if (props.expiresAt < new Date()) {
            throw new errors_1.DomainError("Refresh token expiry must be in the future");
        }
        return new RefreshToken(props.id, props.userId, props.token, props.expiresAt);
    }
    static reconstruct(props) {
        return new RefreshToken(props.id, props.userId, props.token, props.expiresAt, props.isRevoked, props.createdAt, props.updatedAt);
    }
    isExpired() {
        return this.expiresAt.getTime() < Date.now();
    }
    isValid() {
        return !this.isRevoked && !this.isExpired();
    }
    revoke() {
        if (this.isRevoked) {
            throw new errors_1.DomainError("Refresh token is already revoked");
        }
        this.isRevoked = true;
        this.updatedAt = new Date();
    }
    // Getters
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getToken() {
        return this.token;
    }
    getExpiresAt() {
        return this.expiresAt;
    }
    getIsRevoked() {
        return this.isRevoked;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=RefreshToken.js.map