import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { IPasswordService } from '@domain/services/IPasswordService';
import { AppConstants } from '@shared/constants/AppConstants';
import { Logger } from '@shared/utils/Logger';

@injectable()
export class BcryptPasswordService implements IPasswordService {
    async hash(password: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(password, AppConstants.BCRYPT_ROUNDS);
            Logger.debug('Password hashed successfully');
            return hashedPassword;
        } catch (error) {
            Logger.error('Error hashing password', error);
            throw new Error('Failed to hash password');
        }
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            Logger.debug('Password comparison completed', { isMatch });
            return isMatch;
        } catch (error) {
            Logger.error('Error comparing password', error);
            throw new Error('Failed to compare password');
        }
    }
}
