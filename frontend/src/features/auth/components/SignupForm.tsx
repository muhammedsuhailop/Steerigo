import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  signupUser,
  clearError,
  setPendingVerificationEmail,
} from "@/redux/slices/authSlice";
import type { SignupCredentials, UserRole } from "@/types";
import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
} from "@/utils";
import steerigoLogoBanner from "@/assets/images/SteeriGoHorizontal.png";
import Button from "@/components/common/Button";
import Input from "@/components/forms/Input";
import OTPVerification from "./OTPVerification";

interface SignupFormData {
  readonly name: string;
  readonly email: string;
  readonly mobile: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly role: UserRole;
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
  //   const navigate = useNavigate();
  const { isLoading, error, requiresOTPVerification } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "rider",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (requiresOTPVerification) {
      setShowOTPVerification(true);
      dispatch(setPendingVerificationEmail(formData.email));
    }
  }, [requiresOTPVerification, formData.email, dispatch]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (!validateName(formData.name)) {
      errors.name = "Name must be between 2 and 50 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.mobile)) {
      errors.mobile = "Please enter a valid mobile number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors[0];
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange =
    (field: keyof SignupFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      let value = e.target.value;

      if (field === "name") {
        value = sanitizeInput(value);
      } else if (field === "email") {
        value = sanitizeInput(value.toLowerCase());
      }

      setFormData((prev) => ({ ...prev, [field]: value }));

      if (validationErrors[field as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      if (error) {
        dispatch(clearError());
      }
    };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials: SignupCredentials = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role,
    };

    try {
      await dispatch(signupUser(credentials)).unwrap();
    } catch (err) {
      console.log(err);

      // error is already handled by Redux slice
    }
  };

  const handleGoogleSignup = (): void => {
    // Implement Google Sign-Up logic here
    console.log("Google Sign-Up clicked");
  };

  const handleBackToSignup = (): void => {
    setShowOTPVerification(false);
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <OTPVerification email={formData.email} onBack={handleBackToSignup} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <img
                src={steerigoLogoBanner}
                alt="SteerGo Logo"
                className="mb-2 max-h-16 w-auto"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Signup</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form inputs as you already wrote */}

            {/* Name */}
            <Input
              id="name"
              name="name"
              type="text"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange("name")}
              error={validationErrors.name}
              placeholder="Enter your Full Name"
              disabled={isLoading}
              autoComplete="name"
              required
            />

            {/* Email */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={validationErrors.email}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
              required
            />

            {/* Mobile Number */}
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              label="Mobile Number"
              value={formData.mobile}
              onChange={handleInputChange("mobile")}
              error={validationErrors.mobile}
              placeholder="Enter your Mobile Number"
              disabled={isLoading}
              autoComplete="tel"
              required
            />

            {/* Password */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={validationErrors.password}
              placeholder="Enter your Password"
              disabled={isLoading}
              autoComplete="new-password"
              required
            />

            {/* Confirm Password */}
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={validationErrors.confirmPassword}
              placeholder="Confirm password"
              disabled={isLoading}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              fullWidth
            >
              Create New Account
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignup}
              variant="secondary"
              size="lg"
              disabled={isLoading}
              fullWidth
            >
              Signing with Google
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Existing User?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
