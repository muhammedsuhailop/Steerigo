import { DomainError } from './DomainError';
export class RefreshTokenExpiredError extends DomainError {
    constructor() {
        super('Refresh token has expired');
        this.name = 'RefreshTokenExpiredError';
    }
}