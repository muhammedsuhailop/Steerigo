// src/features/auth/components/ForgotPasswordForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  requestPasswordReset,
  clearError,
  clearError as clearResetError,
  resetPassword,
} from "@/redux/slices/authSlice";
import type { ResetPasswordConfirmCredentials } from "@/types";
import { OTP_CONFIG } from "@/constants";
import Button from "@/components/common/Button";
import Input from "@/components/forms/Input";
import TitleLogo from "@/assets/images/SteeriGoHorizontal.png";

const ForgotPasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, passwordResetEmailSent, isAuthenticated } =
    useAppSelector((s) => s.auth);

  // Local state
  const [email, setEmail] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState<string[]>(
    new Array(OTP_CONFIG.LENGTH).fill("")
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // After requesting reset, show OTP form
  useEffect(() => {
    if (passwordResetEmailSent) {
      setShowOtpStep(true);
    }
  }, [passwordResetEmailSent]);

  // Redirect when logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle email submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await dispatch(requestPasswordReset(email.trim())).unwrap();
    } catch {
      // error shown via Redux
    }
  };

  // Handle OTP change
  const handleOtpChange = (idx: number, val: string) => {
    if (/^\d?$/.test(val)) {
      const arr = [...otp];
      arr[idx] = val;
      setOtp(arr);
      if (val && idx < OTP_CONFIG.LENGTH - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
      if (error) dispatch(clearResetError());
    }
  };

  // Handle reset submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_CONFIG.LENGTH) return;
    if (!newPassword || newPassword !== confirmPassword) return;
    const creds: ResetPasswordConfirmCredentials & { email: string } = {
      email: email.trim(),
      otp: code,
      newPassword,
      confirmPassword,
      token: "", // if your backend expects token field, else remove
    };
    try {
      await dispatch(resetPassword(creds)).unwrap();
      // on success, backend logs user out; redirect back to login
      navigate("/login", { replace: true });
    } catch {
      // error shown via Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex flex-col items-center justify-center mb-2">
                <img
                  src={TitleLogo}
                  alt="SteerGo Logo"
                  className="mb-1 max-h-16 w-auto"
                />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {showOtpStep ? "Reset Password" : "Forgot Password"}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {/* Step 1: Enter email */}
          {!showOtpStep && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" fullWidth loading={isLoading}>
                Send OTP
              </Button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: Enter OTP + new password */}
          {showOtpStep && (
            <form
              onSubmit={handleResetSubmit}
              className="space-y-6 text-center"
            >
              <p className="text-sm text-gray-600">
                Enter the {OTP_CONFIG.LENGTH}-digit code sent to {email}
              </p>
              <div className="flex justify-center space-x-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el!;
                    }}
                    type="text"
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={1}
                    disabled={isLoading}
                  />
                ))}
              </div>
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" fullWidth loading={isLoading}>
                Reset Password
              </Button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
