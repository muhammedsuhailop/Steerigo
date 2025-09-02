export const AppConstants = {
    OTP_LENGTH: parseInt(process.env.OTP_LENGTH || '4'),
    OTP_TTL_SECONDS: parseInt(process.env.OTP_TTL_SECONDS || '300'),
    MAX_OTP_ATTEMPTS: parseInt(process.env.MAX_OTP_ATTEMPTS || '3'),
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5')
};
