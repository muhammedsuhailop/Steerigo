import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import TitleLogo from "@/assets/images/SteeriGoHorizontal.png";
import {
  signupUser,
  clearError,
  verifyOTP,
  resendOTP,
  clearError as clearOtpError,
} from "@/redux/slices/authSlice";
import type {
  SignupCredentials,
  UserRole,
  VerifyOTPCredentials,
} from "@/types";
import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
} from "@/utils";
import { OTP_CONFIG } from "@/constants";
import Button from "@/components/common/Button";
import Input from "@/components/forms/Input";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && role) {
      const ROLE_ROUTES: Record<string, string> = {
        Rider: "/user/home",
        Driver: "/driver/dashboard",
        Admin: "/admin/dashboard",
      };
      navigate(ROLE_ROUTES[role], { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Local component state
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "Rider",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState<string[]>(
    new Array(OTP_CONFIG.LENGTH).fill("")
  );
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Clear signup errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Validate signup form
  const validateSignup = (): boolean => {
    const errs: ValidationErrors = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    else if (!validateName(formData.name))
      errs.name = "Name must be 2–50 characters";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(formData.email))
      errs.email = "Please enter a valid email";
    if (!formData.mobile.trim()) errs.mobile = "Mobile number is required";
    else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.mobile))
      errs.mobile = "Please enter a valid mobile number";
    if (!formData.password) errs.password = "Password is required";
    else {
      const pwErr = validatePassword(formData.password);
      if (pwErr.length) errs.password = pwErr[0];
    }
    if (!formData.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle signup submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    const creds: SignupCredentials = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role,
    };

    try {
      const response = await dispatch(signupUser(creds)).unwrap();
      if (response.success) {
        setShowOtpForm(true);
      }
    } catch {
      // error message is displayed from Redux state
    }
  };

  // Handle form field changes
  const handleChange =
    (field: keyof SignupFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let val = e.target.value;
      if (field === "name") val = sanitizeInput(val);
      if (field === "email") val = sanitizeInput(val.toLowerCase());
      setFormData((prev) => ({ ...prev, [field]: val }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (error) {
        dispatch(clearError());
        dispatch(clearOtpError());
      }
    };

  // Handle OTP input change
  const handleOtpChange = (idx: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const arr = [...otp];
      arr[idx] = value;
      setOtp(arr);
      if (value && idx < OTP_CONFIG.LENGTH - 1) {
        inputRefs.current[idx + 1]?.focus();
      }
      if (error) dispatch(clearOtpError());
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_CONFIG.LENGTH) return;

    const creds: VerifyOTPCredentials = { email: formData.email, otp: code };
    try {
      await dispatch(verifyOTP(creds)).unwrap();
    } catch {
      // error displayed from Redux state
    }
  };

  const [resendCooldown, setResendCooldown] = useState(0);

  // start cooldown when showing OTP form
  useEffect(() => {
    if (showOtpForm) {
      setResendCooldown(OTP_CONFIG.RESEND_COOLDOWN); // e.g. 60
    }
  }, [showOtpForm]);

  // countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    // dispatch resendOTP action
    try {
      await dispatch(resendOTP(formData.email)).unwrap();
      setOtp(new Array(OTP_CONFIG.LENGTH).fill(""));
      setResendCooldown(OTP_CONFIG.RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    } catch {
      // error handled by Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-1">
            <div className="flex items-center justify-center mb-1">
              <div className="flex flex-col items-center justify-center mb-2">
                <img
                  src={TitleLogo}
                  alt="SteerGo Logo"
                  className="mb-1 max-h-16 w-auto"
                />
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {showOtpForm ? "Verify Your Email" : "Create New Account"}
            </h2>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {!showOtpForm && (
            <form onSubmit={handleSignup} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                error={validationErrors.name}
                required
                disabled={isLoading}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                error={validationErrors.email}
                required
                disabled={isLoading}
              />
              <Input
                label="Mobile Number"
                type="tel"
                value={formData.mobile}
                onChange={handleChange("mobile")}
                error={validationErrors.mobile}
                required
                disabled={isLoading}
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                error={validationErrors.password}
                required
                disabled={isLoading}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={validationErrors.confirmPassword}
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => console.log("Google Sign-Up clicked")}
                disabled={isLoading}
              >
                Sign up with Google
              </Button>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Existing User?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Login
                  </Link>
                </span>
              </div>
            </form>
          )}

          {showOtpForm && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 text-center">
              <p className="text-sm text-gray-600">
                Enter the {OTP_CONFIG.LENGTH}-digit code sent to{" "}
                {formData.email}
              </p>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el!;
                    }}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={1}
                    disabled={isLoading}
                  />
                ))}
              </div>
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <div className="text-center">
                {resendCooldown > 0 ? (
                  <span className="text-sm text-gray-600">
                    Resend code in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                    onClick={handleResend}
                    disabled={isLoading}
                  >
                    Resend Code
                  </button>
                )}
                <button
                  type="button"
                  className="text-sm text-gray-600 ml-4"
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtp(new Array(OTP_CONFIG.LENGTH).fill(""));
                    dispatch(clearOtpError());
                  }}
                  disabled={isLoading}
                >
                  Back to Signup
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
