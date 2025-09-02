import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { SignupRequestUseCase } from "@application/use-cases/SignupRequestUseCase";
import { SignupVerifyUseCase } from "@application/use-cases/SignupVerifyUseCase";
import { LoginUseCase } from "@application/use-cases/LoginUseCase";
import { ResendOtpUseCase } from "@application/use-cases/ResendOtpUseCase";
import { UpdatePasswordUseCase } from '@application/use-cases/UpdatePasswordUseCase';

import { SignupRequestDto } from "@application/dto/SignupRequestDto";
import { SignupVerifyDto } from "@application/dto/SignupVerifyDto";
import { LoginDto } from "@application/dto/LoginDto";
import { ResendOtpDto } from "@application/dto/ResendOtpDto";
import { UpdatePasswordDto } from '@application/dto/UpdatePasswordDto';

import { ApiResponse } from "@shared/types/Common";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class AuthController {
    constructor(
        @inject(SignupRequestUseCase)
        private signupRequestUseCase: SignupRequestUseCase,
        @inject(SignupVerifyUseCase)
        private signupVerifyUseCase: SignupVerifyUseCase,
        @inject(LoginUseCase) private loginUseCase: LoginUseCase,
        @inject(ResendOtpUseCase) private resendOtpUseCase: ResendOtpUseCase,
        @inject(UpdatePasswordUseCase) private updatePasswordUseCase: UpdatePasswordUseCase
    ) { }

    async signupRequest(req: Request, res: Response): Promise<void> {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const response: ApiResponse = {
                    success: false,
                    message: "Validation failed",
                    error: errors
                        .array()
                        .map((err) => `${err.msg}`)
                        .join(", "),
                };
                res.status(400).json(response);
                return;
            }

            const dto = new SignupRequestDto(req.body);
            const result = await this.signupRequestUseCase.execute(dto);

            if (result.isFailure()) {
                const error = result.getError();
                const response: ApiResponse = {
                    success: false,
                    message: error.message,
                };
                res.status(400).json(response);
                return;
            }

            const response: ApiResponse = {
                success: true,
                message:
                    "OTP sent to your email address. Please verify to complete signup.",
            };

            res.status(200).json(response);
            Logger.info("Signup request processed successfully", {
                email: dto.email,
            });
        } catch (error) {
            Logger.error("Error in signup request", error);
            const response: ApiResponse = {
                success: false,
                message: "Internal server error",
            };
            res.status(500).json(response);
        }
    }

    async signupVerify(req: Request, res: Response): Promise<void> {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const response: ApiResponse = {
                    success: false,
                    message: "Validation failed",
                    error: errors
                        .array()
                        .map((err) => `${err.msg}`)
                        .join(", "),
                };
                res.status(400).json(response);
                return;
            }

            const dto = new SignupVerifyDto(req.body);
            const result = await this.signupVerifyUseCase.execute(dto);

            if (result.isFailure()) {
                const error = result.getError();
                const response: ApiResponse = {
                    success: false,
                    message: error.message,
                };

                // Different status codes for different error types
                if (error.name === "MaxOtpAttemptsError") {
                    res.status(429).json(response);
                } else {
                    res.status(400).json(response);
                }
                return;
            }

            const data = result.getValue();
            const response: ApiResponse = {
                success: true,
                message: "Signup completed successfully! Welcome to SteeriGo.",
                data,
            };

            res.status(201).json(response);
            Logger.info("Signup verification completed successfully", {
                email: dto.email,
            });
        } catch (error) {
            Logger.error("Error in signup verification", error);
            const response: ApiResponse = {
                success: false,
                message: "Internal server error",
            };
            res.status(500).json(response);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const response: ApiResponse = {
                    success: false,
                    message: "Validation failed",
                    error: errors
                        .array()
                        .map((err) => `${err.msg}`)
                        .join(", "),
                };
                res.status(400).json(response);
                return;
            }

            const dto = new LoginDto(req.body);
            const result = await this.loginUseCase.execute(dto);

            if (result.isFailure()) {
                const error = result.getError();
                const response: ApiResponse = {
                    success: false,
                    message: error.message,
                };
                res.status(401).json(response);
                return;
            }

            const data = result.getValue();
            const response: ApiResponse = {
                success: true,
                message: "Login successful",
                data,
            };

            res.status(200).json(response);
            Logger.info("Login completed successfully", { email: dto.email });
        } catch (error) {
            Logger.error("Error in login", error);
            const response: ApiResponse = {
                success: false,
                message: "Internal server error",
            };
            res.status(500).json(response);
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const response: ApiResponse = {
                    success: false,
                    message: "Validation failed",
                    error: errors
                        .array()
                        .map((err) => `${err.msg}`)
                        .join(", "),
                };
                res.status(400).json(response);
                return;
            }

            const dto = new ResendOtpDto(req.body);
            const result = await this.resendOtpUseCase.execute(dto);

            if (result.isFailure()) {
                const error = result.getError();
                const response: ApiResponse = {
                    success: false,
                    message: error.message,
                };
                res.status(400).json(response);
                return;
            }

            const response: ApiResponse = {
                success: true,
                message: "New OTP sent to your email address",
            };

            res.status(200).json(response);
            Logger.info("OTP resent successfully", { email: dto.email });
        } catch (error) {
            Logger.error("Error in resend OTP", error);
            const response: ApiResponse = {
                success: false,
                message: "Internal server error",
            };
            res.status(500).json(response);
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Validation Failed',
                    error: errors
                        .array()
                        .map((err) => `${err.msg}`)
                        .join(", "),
                };
                res.status(400).json(response);
                return;
            }

            const userId = req.user!.userId;
            const dto = new UpdatePasswordDto(req.body);
            const result = await this.updatePasswordUseCase.execute(userId, dto);

            if (result.isFailure()) {
                const error = result.getError();
                const response: ApiResponse = {
                    success: false,
                    message: error.message
                };

                const statusCode = error.name === 'InvalidCredentialsError' ? 401 : 400;
                res.status(statusCode).json(response);
                return
            }
            const response: ApiResponse = {
                success: true,
                message: 'Password updated successfully'
            };

            res.status(200).json(response);
            Logger.info('Password updated successfully', { userId });
        } catch (error) {
            Logger.error('Error in update password', error);
            const response: ApiResponse = {
                success: false,
                message: 'Internal server error'
            };
            res.status(500).json(response);
        }
    }
}
