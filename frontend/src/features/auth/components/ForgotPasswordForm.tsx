import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  requestPasswordReset,
  clearError,
  resetPassword,
} from "@/redux/slices/authSlice";
import type { ResetPasswordConfirmCredentials } from "@/types";
import { OTP_CONFIG } from "@/constants";
import Button from "@/components/common/Button";
import Input from "@/components/forms/Input";
import TitleLogo from "@/assets/images/SteeriGoHorizontal.png";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

const ForgotPasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, passwordResetEmailSent, isAuthenticated } =
    useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState<string[]>(
    new Array(OTP_CONFIG.LENGTH).fill("")
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (passwordResetEmailSent) {
      setShowOtpStep(true);
      setTimer(60);
    }
  }, [passwordResetEmailSent]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  useEffect(() => {
    if (isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await dispatch(requestPasswordReset(email.trim())).unwrap();
    } catch {}
  };

  const handleResend = async () => {
    try {
      await dispatch(requestPasswordReset(email.trim())).unwrap();
      setOtp(new Array(OTP_CONFIG.LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setTimer(60);
    } catch {}
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (/^\d?$/.test(val)) {
      const arr = [...otp];
      arr[idx] = val;
      setOtp(arr);
      if (val && idx < OTP_CONFIG.LENGTH - 1)
        inputRefs.current[idx + 1]?.focus();
      if (error) dispatch(clearError());
      if (otpError) setOtpError(null);
    }
  };

  function validatePasswords(): boolean {
    if (!PASSWORD_REGEX.test(newPassword)) {
      if (newPassword.length < 8 || newPassword.length > 128) {
        setPasswordError("Password must be 8–128 characters long");
      } else {
        setPasswordError(
          "Password must include lowercase, uppercase, number, and special character"
        );
      }
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError(null);
    return true;
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_CONFIG.LENGTH) {
      setOtpError(`Enter all ${OTP_CONFIG.LENGTH} OTP digits`);
      return;
    }
    if (!validatePasswords()) return;
    const creds: ResetPasswordConfirmCredentials & { email: string } = {
      email: email.trim(),
      otp: code,
      newPassword,
      confirmPassword,
    };
    try {
      await dispatch(resetPassword(creds)).unwrap();
      navigate("/login", { replace: true });
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src={TitleLogo}
                alt="SteeriGo Logo"
                className="mx-auto mb-4 max-h-16 w-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {showOtpStep ? "Reset Password" : "Forgot Password"}
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {!showOtpStep ? (
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
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <p className="text-sm text-gray-600 text-center">
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
              {otpError && (
                <p className="text-sm text-red-600 text-center">{otpError}</p>
              )}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in 0:{timer.toString().padStart(2, "0")}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                )}
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
              {passwordError && (
                <p className="text-sm text-red-600 text-center">
                  {passwordError}
                </p>
              )}
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
