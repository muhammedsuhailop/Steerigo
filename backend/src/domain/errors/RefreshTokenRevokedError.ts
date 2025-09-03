import { DomainError } from './DomainError';
export class RefreshTokenRevokedError extends DomainError {
    constructor() {
        super('Refresh token has been revoked');
        this.name = 'RefreshTokenRevokedError';
    }
}