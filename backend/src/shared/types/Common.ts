export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface AuthTokenPayload {
    userId: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        role: string;
    };
}