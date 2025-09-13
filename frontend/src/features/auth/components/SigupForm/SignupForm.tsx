/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupForm } from "../../hooks/useAuthForm";
import { useAuth } from "../../hooks/useAuth";
import { useSignupMutation, useVerifyOTPMutation, useResendOTPMutation } from "../../services/authApi";
import type { SignupFormProps } from "./SignupForm.types";
import LogoText from "@/../public/SteeriGoHorizontal.png";
import {
    FaRegEye,
    FaRegEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { getUserDashboardPath } from "../../hooks/useAuth";

export const SignupForm: React.FC<SignupFormProps> = ({
    onSubmit,
    isLoading = false,
    className = "",
    showGoogleAuth = true,
}) => {
    const navigate = useNavigate();
    const { loginWithGoogle, userRole } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [otpValue, setOtpValue] = useState("");
    const [otpError, setOtpError] = useState("");

    // API mutations
    const [signupMutation, { isLoading: isSignupLoading }] = useSignupMutation();
    const [verifyOTPMutation, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
    const [resendOTPMutation] = useResendOTPMutation();

    const {
        formData,
        errors,
        isSubmitting,
        submitMessage,
        handleChange,
        handleSubmit,
    } = useSignupForm(
        onSubmit ||
        (async (data: any) => {
            try {
                const result = await signupMutation(data).unwrap();
                if (result.success) {
                    setShowOtpSection(true);
                    setOtpTimer(60);
                }
                return result;
            } catch (error: any) {
                return {
                    success: false,
                    message: error.data?.message || "Signup failed. Please try again.",
                };
            }
        })
    );

    // OTP Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleGoogleSignup = async () => {
        try {
            setShowPassword(false);
            setShowConfirmPassword(false);
            await loginWithGoogle();
        } catch (error) {
            console.error("Google signup failed:", error);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{4}$/.test(otpValue)) {
            setOtpError("OTP must be 4 digits");
            return;
        }
        if (!formData.email) {
            setOtpError("Email not found. Please restart signup process.");
            return;
        }

        try {
            const result = await verifyOTPMutation({
                email: formData.email,
                otp: otpValue,
            }).unwrap();

            if (result.success) {
                const redirectPath = getUserDashboardPath(result.data.user.role);
                navigate(redirectPath);
            }
        } catch (error: any) {
            setOtpError(error.data?.message || "OTP verification failed");
        }
    };

    const handleResendOtp = async () => {
        try {
            setOtpError("");
            setOtpTimer(60);
            await resendOTPMutation({ email: formData.email }).unwrap();
        } catch (error: any) {
            setOtpError("Failed to resend OTP. Please try again.");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className={`w-full max-w-sm mx-auto ${className}`}>
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                    <img src={LogoText} alt="SteeriGo Logo" className="w-3/4 h-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {showOtpSection ? "Verify Your Email" : "Create Account"}
                </h2>
                {showOtpSection && (
                    <p className="text-sm text-gray-600">
                        We've sent a 4-digit code to {formData.email}
                    </p>
                )}
            </div>

            {/* Submit Message */}
            {submitMessage && (
                <div
                    className={`p-3 rounded-md text-sm mb-2 ${submitMessage.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                >
                    <p>{submitMessage.text}</p>
                </div>
            )}

            {!showOtpSection ? (
                /* Signup Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        id="name"
                        label="Full Name"
                        value={formData.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={errors.name}
                        isInvalid={!!errors.name}
                        disabled={isSubmitting || isLoading || isSignupLoading}
                        placeholder="Enter your full name"
                    />

                    <Input
                        type="email"
                        id="email"
                        label="Email"
                        value={formData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={errors.email}
                        isInvalid={!!errors.email}
                        disabled={isSubmitting || isLoading || isSignupLoading}
                        placeholder="Enter your email"
                    />

                    <Input
                        type="tel"
                        id="mobile"
                        label="Mobile Number"
                        value={formData.mobile || ""}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        error={errors.mobile}
                        isInvalid={!!errors.mobile}
                        disabled={isSubmitting || isLoading || isSignupLoading}
                        placeholder="Enter your mobile number"
                    />

                    <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        label="Password"
                        value={formData.password || ""}
                        onChange={(e) => handleChange("password", e.target.value)}
                        error={errors.password}
                        isInvalid={!!errors.password}
                        disabled={isSubmitting || isLoading || isSignupLoading}
                        placeholder="Create a strong password"
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none"
                                disabled={isSubmitting || isLoading || isSignupLoading}
                            >
                                {showPassword ? (
                                    <FaRegEyeSlash className="text-gray-500" />
                                ) : (
                                    <FaRegEye className="text-gray-500" />
                                )}
                            </button>
                        }
                    />

                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        label="Confirm Password"
                        value={formData.confirmPassword || ""}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        error={errors.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                        disabled={isSubmitting || isLoading || isSignupLoading}
                        placeholder="Confirm your password"
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="focus:outline-none"
                                disabled={isSubmitting || isLoading || isSignupLoading}
                            >
                                {showConfirmPassword ? (
                                    <FaRegEyeSlash className="text-gray-500" />
                                ) : (
                                    <FaRegEye className="text-gray-500" />
                                )}
                            </button>
                        }
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        isLoading={isSubmitting || isLoading || isSignupLoading}
                        disabled={isSubmitting || isLoading || isSignupLoading}
                    >
                        Create Account
                    </Button>

                    {showGoogleAuth && (
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            fullWidth
                            leftIcon={<FcGoogle className="w-5 h-5" />}
                            onClick={handleGoogleSignup}
                            disabled={isSubmitting || isLoading || isSignupLoading}
                        >
                            Sign up with Google
                        </Button>
                    )}
                </form>
            ) : (
                /* OTP Verification Form */
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <Input
                        type="text"
                        id="otp"
                        label="Enter 4-Digit Code"
                        value={otpValue}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setOtpValue(value);
                            if (otpError) setOtpError("");
                        }}
                        error={otpError}
                        isInvalid={!!otpError}
                        placeholder="0000"
                        maxLength={4}
                        disabled={isVerifyingOTP}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        fullWidth
                        isLoading={isVerifyingOTP}
                        disabled={isVerifyingOTP || !otpValue}
                    >
                        Verify Email
                    </Button>

                    {/* Resend OTP */}
                    <div className="flex items-center justify-center text-sm">
                        {otpTimer > 0 ? (
                            <p className="text-gray-600">
                                Resend code in{" "}
                                <span className="font-mono font-semibold text-blue-600">
                                    {formatTime(otpTimer)}
                                </span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-gray-700 hover:text-gray-900 font-medium"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setShowOtpSection(false);
                                setOtpValue("");
                                setOtpError("");
                                setOtpTimer(0);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            ← Back to signup
                        </button>
                    </div>
                </form>
            )}

            {/* Login Link */}
            {!showOtpSection && (
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-gray-800 hover:text-gray-900"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
};
