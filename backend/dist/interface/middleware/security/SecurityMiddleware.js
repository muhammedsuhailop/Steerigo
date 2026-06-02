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
        return (0, cors_1.default)({
            origin: process.env.NODE_ENV === "production"
                ? ["https://steerigo.com", "https://www.steerigo.com"]
                : [
                    "http://localhost:5173",
                    "http://localhost:4000",
                    "http://localhost:4001",
                    /https:\/\/.*\.ngrok-free\.app$/,
                ],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true, // allows cookies
            exposedHeaders: ["Set-Cookie"], // Allow frontend to see Set-Cookie header
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