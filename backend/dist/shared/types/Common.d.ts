export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: {
        field: string;
        message: string;
    }[];
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
//# sourceMappingURL=Common.d.ts.map