import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupForm } from "../../hooks/useAuthForm";
import type { SignupFormProps } from "./SignupForm.types";
import LogoText from "@/../public/SteeriGoHorizontal.png";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaMobile,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useAuth } from "../../hooks/useAuth";

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isLoading = false,
  className = "",
  showGoogleAuth = true,
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");

  const {
    formData,
    errors,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
  } = useSignupForm(async (data: any) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      setShowOtpSection(true);
      setOtpTimer(60);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  });

  // Countdown for OTP resend
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
    // implement Google signup flow if needed
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otpValue)) {
      setOtpError("OTP must be 4 digits");
      return;
    }

    // Debug: Check if email exists
    console.log("Sending OTP verification:", {
      email: formData.email,
      otp: otpValue,
    });

    if (!formData.email) {
      setOtpError("Email not found. Please restart signup process.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      });

      console.log("OTP Response status:", res.status);
      const result = await res.json();
      console.log("OTP Response body:", result);

      if (result.success) {
        alert("Email verified! You can now log in.");
        navigate("/login");
      } else {
        setOtpError(result.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("Network error. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtpTimer(60);
    await fetch("/api/auth/signup/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="text-center mb-8">
        <img src={LogoText} alt="SteeriGo" className="h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {showOtpSection ? "Verify Your Email" : "Create Account"}
        </h1>
        <p className="text-gray-600">
          {showOtpSection
            ? `We've sent a 4-digit code to ${formData.email}`
            : "Join SteeriGo today and start your journey"}
        </p>
      </div>

      {submitMessage && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {!showOtpSection ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            isInvalid={!!errors.name}
            disabled={isSubmitting || isLoading}
            placeholder="Enter your full name"
            leftIcon={<FaUser className="w-4 h-4 text-gray-400" />}
            isRequired
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            isInvalid={!!errors.email}
            disabled={isSubmitting || isLoading}
            placeholder="Enter your email address"
            leftIcon={<FaEnvelope className="w-4 h-4 text-gray-400" />}
            isRequired
          />

          <Input
            label="Mobile Number"
            type="tel"
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            error={errors.mobile}
            isInvalid={!!errors.mobile}
            disabled={isSubmitting || isLoading}
            placeholder="Enter your mobile number"
            leftIcon={<FaMobile className="w-4 h-4 text-gray-400" />}
            isRequired
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            isInvalid={!!errors.password}
            disabled={isSubmitting || isLoading}
            placeholder="Create a strong password"
            leftIcon={<FaLock className="w-4 h-4 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            isRequired
            helperText="At least 8 characters, uppercase, lowercase, number & special character"
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword || ""}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            isInvalid={!!errors.confirmPassword}
            disabled={isSubmitting || isLoading}
            placeholder="Confirm your password"
            leftIcon={<FaLock className="w-4 h-4 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            }
            isRequired
          />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
            size="lg"
          >
            Create Account
          </Button>

          {showGoogleAuth && (
            <Button
              type="button"
              variant="outline"
              fullWidth
              leftIcon={<FcGoogle className="w-5 h-5" />}
              onClick={handleGoogleSignup}
              disabled={isSubmitting || isLoading}
            >
              Sign up with Google
            </Button>
          )}
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="text-center">
            <Input
              label="Enter 4-Digit Code"
              type="text"
              value={otpValue}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setOtpValue(v);
                if (otpError) setOtpError("");
              }}
              error={otpError}
              isInvalid={!!otpError}
              placeholder="0000"
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={4}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting || !otpValue}
            size="lg"
          >
            Verify Email
          </Button>

          <div className="text-center">
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
                className="text-blue-600 hover:text-blue-700 font-medium"
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
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              ← Back to signup
            </button>
          </div>
        </form>
      )}

      {!showOtpSection && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};
