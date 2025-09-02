import { Request, Response, NextFunction } from 'express';
import { container } from '@infrastructure/container/Container';
import { ITokenService } from '@domain/services/ITokenService';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { ApiResponse } from '@shared/types/Common';
import { Logger } from '@shared/utils/Logger';
// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}
export class AuthMiddleware {
    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Access token required'
                };
                res.status(401).json(response);
                return;
            }
            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            const tokenService = container.get<ITokenService>('ITokenService');
            const payload = tokenService.verify(token);

            if (!payload) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Invalid or expired token'
                };
                res.status(401).json(response);
                return;
            }
            // Optional: Verify user still exists and is active
            const userRepository = container.get<IUserRepository>('IUserRepository');
            const user = await userRepository.findById(payload.userId);

            if (!user || !user.getIsVerified()) {
                const response: ApiResponse = {
                    success: false,
                    message: 'User account not found or not verified'
                };
                res.status(401).json(response);
                return;
            }
            // Add user info to request
            req.user = {
                userId: payload.userId,
                role: payload.role
            };
            next();
        } catch (error) {
            Logger.error('Authentication middleware error', error);
            const response: ApiResponse = {
                success: false,
                message: 'Authentication failed'
            };
            res.status(401).json(response);
        }
    }
}