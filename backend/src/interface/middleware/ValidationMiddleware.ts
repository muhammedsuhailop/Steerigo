import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '@shared/types/Common';

export class ValidationMiddleware {
    static validate(req: Request, res: Response, next: NextFunction): void {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const response: ApiResponse = {
                success: false,
                message: 'Validation failed',
                error: errors.array().map(err => `${err.msg}`).join(', ')
            };
            res.status(400).json(response);
            return;
        }

        next();
    }
}
