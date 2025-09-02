import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@shared/types/Common';
import { Logger } from '@shared/utils/Logger';

export class ErrorHandlerMiddleware {
    static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
        Logger.error('Unhandled error occurred', {
            error: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            body: req.body,
            query: req.query,
            params: req.params
        });

        // Don't log sensitive data in production
        if (process.env.NODE_ENV === 'production') {
            delete req.body.password;
        }

        const response: ApiResponse = {
            success: false,
            message: 'An unexpected error occurred'
        };

        // In development, send detailed error information
        if (process.env.NODE_ENV === 'development') {
            response.error = err.message;
        }

        res.status(500).json(response);
    }

    static notFound(req: Request, res: Response): void {
        const response: ApiResponse = {
            success: false,
            message: `Route ${req.originalUrl} not found`
        };

        res.status(404).json(response);
    }
}
