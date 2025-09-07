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
import Button from "@/components/common/Button";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
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
  const { isLoading, error, requiresOTPVerification } = useAppSelector(
    (state) => state.auth
  );

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
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.mobile)) {
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
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
      <OTPVerification
        email={formData.email}
        onBack={handleBackToSignup}
      />
    );
  }

  const roleOptions = [
    { value: "Rider", label: "Rider" },
    { value: "Driver", label: "Driver" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-auto">
              <div className="text-2xl font-bold text-gray-900">Steerigo</div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Signup
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={validationErrors.name}
              required
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={validationErrors.email}
              required
              disabled={isLoading}
            />

            <Input
              label="Mobile Number"
              type="tel"
              value={formData.mobile}
              onChange={handleInputChange('mobile')}
              error={validationErrors.mobile}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={validationErrors.password}
              required
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={validationErrors.confirmPassword}
              required
              disabled={isLoading}
            />

            <Select
              label="Role"
              value={formData.role}
              onChange={handleInputChange('role')}
              options={roleOptions}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleGoogleSignup}
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
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
