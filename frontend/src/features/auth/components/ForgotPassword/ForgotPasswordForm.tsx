import React, { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForgotPasswordMutation, useResetPasswordMutation, useResendOTPMutation } from "../../services/authApi";
import { validateEmail, validateOTP, validatePassword, validateConfirmPassword } from "../../utils/validation";
import type { ForgotPasswordFormProps } from "./ForgotPasswordForm.types";
import LogoText from '../../../../../public/SteeriGoHorizontal.png'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    className = "",
    isLoading = false,
}) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [phase, setPhase] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [timer, setTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [forgotPassword, { isLoading: isRequesting }] = useForgotPasswordMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
    const [resendOtp] = useResendOTPMutation();

    // OTP countdown
    useEffect(() => {
        if (timer <= 0) return;
        const id = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [timer]);

    // Phase 1: submit email
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateEmail(email);
        if (err) { setEmailError(err); return; }
        setEmailError("");
        try {
            const res = await forgotPassword({ email }).unwrap();
            if (res.success) {
                setPhase(2);
                setTimer(60);
            } else {
                setEmailError(res.message);
            }
        } catch {
            setEmailError("Failed to send OTP. Try again.");
        }
    };

    // Phase 2: submit OTP + new passwords
    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const e1 = validateOTP(otp);
        const e2 = validatePassword(newPassword);
        const e3 = validateConfirmPassword(newPassword, confirmPassword);
        setOtpError(e1 || "");
        setNewPasswordError(e2 || "");
        setConfirmPasswordError(e3 || "");
        if (e1 || e2 || e3) return;

        try {
            const res = await resetPassword({ email, otp, newPassword, confirmPassword }).unwrap();
            if (res.success) {
                await login({ email, password: newPassword });
                navigate("/");
            } else {
                setOtpError(res.message);
            }
        } catch {
            setOtpError("Reset failed. Try again.");
        }
    };

    const handleResend = async () => {
        try {
            console.log('resend emsial', { email })
            await resendOtp({ email }).unwrap();
            setTimer(30);
            setOtpError("");
        } catch {
            setOtpError("Resend failed. Try again.");
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60), r = s % 60;
        return `${m}:${r.toString().padStart(2, "0")}`;
    };

    return (
        <div className={`w-full max-w-sm mx-auto ${className}`}>
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                    <img src={LogoText} alt="SteeriGo Logo" className="w-3/4 h-auto" />
                </div>
            </div>
            {phase === 1 ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <h2 className="text-center text-xl font-semibold">Forgot Password</h2>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        error={emailError}
                        isInvalid={!!emailError}
                        placeholder="Enter your email"
                        disabled={isRequesting || isLoading}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isRequesting}
                        disabled={isRequesting}
                    >
                        Send OTP
                    </Button>
                    <p className="text-sm text-center">
                        Remembered?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                    <h2 className="text-center text-xl font-semibold">Reset Password</h2>
                    <Input
                        label="OTP"
                        type="text"
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value); setOtpError(""); }}
                        error={otpError}
                        isInvalid={!!otpError}
                        placeholder="0000"
                        maxLength={4}
                        disabled={isResetting}
                        className="text-center text-2xl font-mono"
                    />
                    <Input
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(""); }}
                        error={newPasswordError}
                        isInvalid={!!newPasswordError}
                        placeholder="Enter new password"
                        disabled={isResetting}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none"
                                disabled={isLoading}
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
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(""); }}
                        error={confirmPasswordError}
                        isInvalid={!!confirmPasswordError}
                        placeholder="Confirm new password"
                        disabled={isResetting}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="focus:outline-none"
                                disabled={isLoading}
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
                        fullWidth
                        isLoading={isResetting}
                        disabled={isResetting}
                    >
                        Reset Password
                    </Button>
                    <div className="text-center text-sm">
                        {timer > 0 ? (
                            <span>Resend in {formatTime(timer)}</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-blue-600 hover:underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};