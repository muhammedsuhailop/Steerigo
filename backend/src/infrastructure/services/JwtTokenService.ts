import { injectable } from 'inversify';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { ITokenService } from '@domain/services/ITokenService';
import { AppConstants } from '@shared/constants/AppConstants';
import { AuthTokenPayload } from '@shared/types/Common';
import { Logger } from '@shared/utils/Logger';

@injectable()
export class JwtTokenService implements ITokenService {
    private readonly jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || '';
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
    }

    generate(payload: { userId: string; role: string }): string {
        try {
            const token = jwt.sign(
                { userId: payload.userId, role: payload.role },
                this.jwtSecret,
                {
                    expiresIn: AppConstants.JWT_EXPIRES_IN,
                    issuer: 'Steerigo',
                    audience: 'Steerigo-Users'
                } as jwt.SignOptions
            );

            Logger.debug('JWT token generated successfully', { userId: payload.userId });
            return token;
        } catch (error) {
            Logger.error('Error generating JWT token', error);
            throw new Error('Failed to generate authentication token');
        }
    }

    verify(token: string): { userId: string; role: string } | null {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                issuer: 'Steerigo',
                audience: 'Steerigo-Users'
            }) as AuthTokenPayload;

            Logger.debug('JWT token verified successfully', { userId: decoded.userId });
            return {
                userId: decoded.userId,
                role: decoded.role
            };
        } catch (error) {
            Logger.debug('JWT token verification failed', error);
            return null;
        }
    }

    generateRefreshToken(): string {
        try {
            // Generate a cryptographically secure random token
            const randomBytes = crypto.randomBytes(64);
            const refreshToken = randomBytes.toString('hex');

            Logger.debug('Refresh token generated successfully');
            return refreshToken;
        } catch (error) {
            Logger.error('Error generating refresh token', error);
            throw new Error('Failed to generate refresh token');
        }
    }
}
