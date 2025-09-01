import rateLimit from 'express-rate-limit';


export const generalLimiter = rateLimit({
windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
max: parseInt(process.env.RATE_LIMIT_MAX || '10', 10),
message: { message: 'Too many requests, please try later.' }
});


export const signupLimiter = rateLimit({
windowMs: 60 * 60 * 1000, // 1 hour
max: 5, // max 5 signup requests per IP per hour
message: { message: 'Too many signup attempts from this IP, please try later.' }
});