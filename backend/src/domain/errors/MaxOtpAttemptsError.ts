import { DomainError } from './DomainError';

export class MaxOtpAttemptsError extends DomainError {
    constructor() {
        super('Maximum OTP attempts exceeded. Please request a new OTP');
        this.name = 'MaxOtpAttemptsError';
    }
}
