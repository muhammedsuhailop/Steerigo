import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';

export class SecurityMiddleware {
    static helmet() {
        return helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            }
        });
    }

    static cors() {
        return cors({
            origin: process.env.NODE_ENV === 'production'
                ? ['https://steerigo.com', 'https://www.steerigo.com']
                : ['http://localhost:4000', 'http://localhost:4001'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        });
    }

    static requestLogger(req: Request, res: Response, next: NextFunction): void {
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        });

        next();
    }
}
