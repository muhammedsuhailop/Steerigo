import { DomainError } from './DomainError';

export class UserAlreadyExistsError extends DomainError {
    constructor() {
        super('User with this email already exists');
        this.name = 'UserAlreadyExistsError';
    }
}
