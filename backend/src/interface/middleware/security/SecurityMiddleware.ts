import { Request, Response, NextFunction, RequestHandler } from "express";
import helmet from "helmet";
import cors from "cors";

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
        preload: true,
      },
    });
  }

  static cors(): RequestHandler {
    // Change return type to RequestHandler
    const productionOrigins = [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/` : undefined,
      "https://msuhail.xyz",
      "https://www.msuhail.xyz",
    ].filter((origin): origin is string => !!origin);

    const developmentOrigins: (string | RegExp)[] = [
      "http://localhost:5173",
      "http://localhost:4000",
      "http://165.227.93.170",
      "http://localhost:4001",
      /https:\/\/.*\.ngrok-free\.app$/,
    ];

    // Wrap the options inside cors() before returning it
    return cors({
      origin:
        process.env.NODE_ENV === "production"
          ? productionOrigins
          : developmentOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      exposedHeaders: ["Set-Cookie"],
    });
  }

  static requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
