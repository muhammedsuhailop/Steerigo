import { DomainError } from './DomainError';

export class OtpExpiredError extends DomainError {
    constructor() {
        super('OTP has expired. Please request a new one');
        this.name = 'OtpExpiredError';
    }
}
