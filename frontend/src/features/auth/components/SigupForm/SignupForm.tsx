/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSignupForm } from "../../hooks/useAuthForm";
import { useAuth } from "../../hooks/useAuth";
import { 
  useSignupMutation, 
  useVerifyOTPMutation, 
  useResendOTPMutation 
} from "../../services/authApi";
import { selectErrorsByContext } from "../../../../shared/components/ui/ErrorHandling/errorSlice";
import { errorHandler, AuthContext } from "../../../../shared/utils/errorUtils";
import type { SignupFormProps } from "./SignupForm.types";
import type { RootState } from "@/app/store";
import LogoText from "@/../public/SteeriGoHorizontal.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
  const { loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpValue, setOtpValue] = useState("");

  // Get errors from centralized system
  const signupErrors = useSelector((state: RootState) =>
    selectErrorsByContext(AuthContext.SIGNUP)(state)
  );
  const otpErrors = useSelector((state: RootState) =>
    selectErrorsByContext(AuthContext.OTP_VERIFICATION)(state)
  );

  // API mutations
  const [signupMutation, { isLoading: isSignupLoading }] = useSignupMutation();
  const [verifyOTPMutation, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [resendOTPMutation] = useResendOTPMutation();

  const {
    formData,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
    getFieldError,
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
          // Error handled by middleware
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

  // Clear errors on component unmount
//   useEffect(() => {
//     return () => {
//       clearAuthErrors(AuthContext.SIGNUP);
//       clearAuthErrors(AuthContext.OTP_VERIFICATION);
//     };
//   }, [clearAuthErrors]);

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
    
    // Clear previous OTP errors
    errorHandler.clearAuthErrors(AuthContext.OTP_VERIFICATION);
    
    if (!/^\d{4}$/.test(otpValue)) {
      errorHandler.handleAuthError(
        { response: { status: 400, data: { message: "Invalid OTP format" } } },
        AuthContext.OTP_VERIFICATION,
        "OTP must be 4 digits"
      );
      return;
    }
    
    if (!formData.email) {
      errorHandler.handleAuthError(
        { response: { status: 400, data: { message: "Email not found" } } },
        AuthContext.OTP_VERIFICATION,
        "Email not found. Please restart signup process."
      );
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
      // Error handled by middleware
    }
  };

  const handleResendOtp = async () => {
    errorHandler.clearAuthErrors(AuthContext.OTP_VERIFICATION);
    setOtpTimer(60);
    
    try {
      await resendOTPMutation({ email: formData.email }).unwrap();
    } catch (error: any) {
      // Error handled by middleware
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setOtpValue(value);
    
    // Clear OTP errors when user starts typing
    if (otpErrors.length > 0) {
      errorHandler.clearAuthErrors(AuthContext.OTP_VERIFICATION);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check for critical errors
  const hasCriticalSignupError = signupErrors.some(error => 
    error.severity === "critical" || error.severity === "high"
  );
  const hasCriticalOtpError = otpErrors.some(error => 
    error.severity === "critical" || error.severity === "high"
  );

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Logo */}
      <div className="text-center mb-8">
        <img
          src={LogoText}
          alt="SteeriGo"
          className="mx-auto h-12 w-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {showOtpSection ? "Verify Your Email" : "Create Account"}
        </h1>
        {showOtpSection && (
          <p className="text-gray-600 mt-2">
            We've sent a 4-digit code to {formData.email}
          </p>
        )}
      </div>

      {/* Success Message */}
      {submitMessage && submitMessage.type === "success" && (
        <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-green-700 text-sm">{submitMessage.text}</p>
        </div>
      )}

      {!showOtpSection ? (
        /* Signup Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            error={getFieldError("name")}
            isInvalid={!!getFieldError("name")}
            disabled={isSubmitting || isLoading || isSignupLoading || hasCriticalSignupError}
            placeholder="Enter your full name"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            error={getFieldError("email")}
            isInvalid={!!getFieldError("email")}
            disabled={isSubmitting || isLoading || isSignupLoading || hasCriticalSignupError}
            placeholder="Enter your email"
          />

          <Input
            label="Mobile Number"
            type="tel"
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            error={getFieldError("mobile")}
            isInvalid={!!getFieldError("mobile")}
            disabled={isSubmitting || isLoading || isSignupLoading || hasCriticalSignupError}
            placeholder="Enter your mobile number"
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            error={getFieldError("password")}
            isInvalid={!!getFieldError("password")}
            disabled={isSubmitting || isLoading || isSignupLoading || hasCriticalSignupError}
            placeholder="Create a strong password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword || ""}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={getFieldError("confirmPassword")}
            isInvalid={!!getFieldError("confirmPassword")}
            disabled={isSubmitting || isLoading || isSignupLoading || hasCriticalSignupError}
            placeholder="Confirm your password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || isLoading}
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSubmitting || isLoading || isSignupLoading}
            disabled={hasCriticalSignupError}
          >
            Create Account
          </Button>

          {showGoogleAuth && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              leftIcon={<FcGoogle className="w-5 h-5" />}
              onClick={handleGoogleSignup}
              disabled={isSubmitting || isLoading || isSignupLoading || hasCriticalSignupError}
            >
              Sign up with Google
            </Button>
          )}
        </form>
      ) : (
        /* OTP Verification Form */
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <Input
            label="Verification Code"
            type="text"
            value={otpValue}
            onChange={handleOtpChange}
            error={otpErrors[0]?.userMessage || otpErrors[0]?.message}
            isInvalid={otpErrors.length > 0}
            placeholder="0000"
            maxLength={4}
            disabled={isVerifyingOTP || hasCriticalOtpError}
            className="text-center text-2xl tracking-widest"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isVerifyingOTP}
            disabled={otpValue.length !== 4 || hasCriticalOtpError}
          >
            Verify Code
          </Button>

          {/* Resend OTP */}
          <div className="text-center">
            {otpTimer > 0 ? (
              <p className="text-gray-600 text-sm">
                Resend code in{" "}
                <span className="font-semibold text-blue-600">
                  {formatTime(otpTimer)}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                disabled={isVerifyingOTP}
              >
                Resend verification code
              </button>
            )}
          </div>
        </form>
      )}

      {/* Login Link */}
      {!showOtpSection && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};