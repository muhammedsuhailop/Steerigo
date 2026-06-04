"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
class SecurityMiddleware {
    static helmet() {
        return (0, helmet_1.default)({
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
    static cors() {
        // Change return type to RequestHandler
        const productionOrigins = [
            process.env.CLIENT_URL,
            process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/` : undefined,
            "https://msuhail.xyz",
            "https://www.msuhail.xyz",
        ].filter((origin) => !!origin);
        const developmentOrigins = [
            "http://localhost:5173",
            "http://localhost:4000",
            "http://165.227.93.170",
            "http://localhost:4001",
            /https:\/\/.*\.ngrok-free\.app$/,
        ];
        // Wrap the options inside cors() before returning it
        return (0, cors_1.default)({
            origin: process.env.NODE_ENV === "production"
                ? productionOrigins
                : developmentOrigins,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
            exposedHeaders: ["Set-Cookie"],
        });
    }
    static requestLogger(req, res, next) {
        const start = Date.now();
        res.on("finish", () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        });
        next();
    }
}
exports.SecurityMiddleware = SecurityMiddleware;
//# sourceMappingURL=SecurityMiddleware.js.map