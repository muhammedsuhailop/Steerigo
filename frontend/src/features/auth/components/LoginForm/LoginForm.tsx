import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLoginForm } from "../../hooks/useAuthForm";
import type { LoginFormProps } from "./LoginForm.types";
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

  const {
    formData,
    errors,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
  } = useLoginForm(onSubmit || login);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center">
          <img src={LogoText} alt="SteeriGo Logo" className="w-3/4 h-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Login</h2>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div
          className={`p-3 rounded-md text-sm mb-2 ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <p>{submitMessage.text}</p>
        </div>
      )}
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          type="email"
          id="email"
          label="Email"
          value={formData.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          isInvalid={!!errors.email}
          disabled={isSubmitting || isLoading}
          placeholder="Enter your email"
        />

        {/* Password Field */}
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          label="Password"
          value={formData.password || ""}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          isInvalid={!!errors.password}
          disabled={isSubmitting || isLoading}
          placeholder="Enter your password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
              disabled={isSubmitting || isLoading}
            >
              {showPassword ? (
                <FaRegEyeSlash className="text-gray-500" />
              ) : (
                <FaRegEye className="text-gray-500" />
              )}
            </button>
          }
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center"></div>
          <Link
            to="/forgot-password"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          Login
        </Button>

        {/* Google Auth Button */}
        {showGoogleAuth && (
          <Button
            type="button"
            variant="outline"
            size="md"
            fullWidth
            leftIcon={<FcGoogle className="w-5 h-5" />}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        )}
      </form>

      {/* Sign Up Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-gray-800 hover:text-gray-900"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};
