import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { useLoginForm } from "../../hooks/useAuthForm";
import { selectErrorsByContext } from "../../../../shared/components/ui/ErrorHandling/errorSlice";
import { AuthContext } from "../../../../shared/utils/errorUtils";
import type { LoginFormProps } from "./LoginForm.types";
import type { RootState } from "@/app/store";
import LogoText from "@/../public/SteeriGoHorizontal.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  className = "",
  showGoogleAuth = true,
}) => {
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Get login errors from centralized system
  const loginErrors = useSelector((state: RootState) =>
    selectErrorsByContext(AuthContext.LOGIN)(state)
  );

  const {
    formData,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
    getFieldError, // Use enhanced field error getter
  } = useLoginForm(onSubmit || login);

  // Clear errors when component unmounts or on successful navigation
  // useEffect(() => {
  //   return () => {
  //     clearAuthErrors(AuthContext.LOGIN);
  //   };
  // }, [clearAuthErrors]);

  const handleGoogleLogin = async () => {
    try {
      setShowPassword(false);
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // Check if there are critical login errors that should block the form
  const hasCriticalError = loginErrors.some(error => 
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
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <p className="text-gray-600 mt-2">Welcome back to SteeriGo</p>
      </div>

      {/* Submit Message - Only show local success messages, API errors shown via Toast */}
      {submitMessage && submitMessage.type === "success" && (
        <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-green-700 text-sm">{submitMessage.text}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          label="Email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          error={getFieldError("email")} // Uses centralized + validation errors
          isInvalid={!!getFieldError("email")}
          disabled={isSubmitting || isLoading || hasCriticalError}
          placeholder="Enter your email"
        />

        {/* Password Field */}
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formData.password || ""}
          onChange={(e) => handleChange("password", e.target.value)}
          error={getFieldError("password")}
          isInvalid={!!getFieldError("password")}
          disabled={isSubmitting || isLoading || hasCriticalError}
          placeholder="Enter your password"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Remember me checkbox can be added here if needed */}
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting || isLoading}
          disabled={hasCriticalError}
        >
          Sign In
        </Button>

        {/* Google Auth Button */}
        {showGoogleAuth && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            leftIcon={<FcGoogle className="w-5 h-5" />}
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isLoading || hasCriticalError}
          >
            Sign in with Google
          </Button>
        )}
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};