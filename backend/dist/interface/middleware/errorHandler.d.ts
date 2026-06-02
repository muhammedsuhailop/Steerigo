import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@shared/types/Common";
export declare class ErrorHandlerMiddleware {
    static handle(err: Error, req: Request, res: Response, _next: NextFunction): void;
    static notFound(req: Request, res: Response): void;
    static handleValidationErrors(req: Request, res: Response, next: NextFunction): void;
    static asyncHandler<T extends Request, U extends Response>(fn: (req: T, res: U, next: NextFunction) => Promise<void>): (req: T, res: U, next: NextFunction) => void;
    static handleControllerError(error: unknown, context: string): {
        response: ApiResponse;
        statusCode: number;
    };
}
export declare const handle: typeof ErrorHandlerMiddleware.handle, notFound: typeof ErrorHandlerMiddleware.notFound, handleValidationErrors: typeof ErrorHandlerMiddleware.handleValidationErrors, asyncHandler: typeof ErrorHandlerMiddleware.asyncHandler, handleControllerError: typeof ErrorHandlerMiddleware.handleControllerError;
//# sourceMappingURL=errorHandler.d.ts.map