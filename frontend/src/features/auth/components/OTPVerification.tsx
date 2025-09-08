import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { verifyOTP, resendOTP, clearError } from "@/redux/slices/authSlice";
import { validateOTP } from "@/utils";
import { OTP_CONFIG, ROLE_ROUTES } from "@/constants";
import Button from "@/components/common/Button";
import TitleLogo from "@/assets/images/SteeriGoHorizontal.png";

interface OTPVerificationProps {
  readonly email: string;
  readonly onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState<string[]>(
    new Array(OTP_CONFIG.LENGTH).fill("")
  );
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return (): void => clearInterval(interval);
  }, [resendCooldown]);

  // Redirect after successful verification
  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(ROLE_ROUTES[role], { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleOTPChange = (index: number, value: string): void => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < OTP_CONFIG.LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Clear error when user starts typing
      if (error) {
        dispatch(clearError());
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_CONFIG.LENGTH);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i] || "";
    }

    setOtp(newOtp);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const otpString = otp.join("");

    if (!validateOTP(otpString)) {
      return;
    }

    try {
      await dispatch(verifyOTP({ email, otp: otpString })).unwrap();
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    if (resendCooldown > 0) return;

    try {
      await dispatch(resendOTP(email)).unwrap();
      setResendCooldown(OTP_CONFIG.RESEND_COOLDOWN);
      setOtp(new Array(OTP_CONFIG.LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP failed:", err);
    }
  };

  const isOTPComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="flex flex-col items-center justify-center mb-2">
                <img
                  src={TitleLogo}
                  alt="SteerGo Logo"
                  className="mb-1 max-h-16 w-auto"
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Verify Your Email
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter verification code
              </label>
              <div
                className="flex justify-center space-x-2"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el): void => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    value={digit}
                    onChange={(e): void =>
                      handleOTPChange(index, e.target.value)
                    }
                    onKeyDown={(e): void => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={1}
                    disabled={isLoading}
                    inputMode="numeric"
                    pattern="\d"
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-center text-sm text-red-600">{error}</div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={!isOTPComplete || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </Button>
            </div>

            {/* Back button */}
            <div className="text-center">
              <Button type="button" variant="outline" onClick={onBack}>
                Back to Signup
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
