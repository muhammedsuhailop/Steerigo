import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { loginUser, clearError } from '@/redux/slices/authSlice';
import type { LoginCredentials } from '@/types';
import { validateEmail, sanitizeInput } from '@/utils';
import { ROLE_ROUTES } from '@/constants';
import { log } from '@/utils/logger';
import Button from '@/components/common/Button';
import Input from '@/components/forms/Input';

interface LoginFormData {
  readonly email: string;
  readonly password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [rememberMe, setRememberMe] = useState(false);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && role) {
      const from = (location.state as { from?: { pathname: string } })?.from
        ?.pathname;
      const defaultRoute = ROLE_ROUTES[role];
      log.info('Login success, redirecting', { role, from });
      navigate(from || defaultRoute, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    log.debug('Validation result', errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value =
        field === 'email'
          ? sanitizeInput(e.target.value.toLowerCase())
          : e.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear global error
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

    const credentials: LoginCredentials = {
      email: formData.email.trim(),
      password: formData.password,
    };

    log.info('Login attempt', { email: formData.email });
    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (err: unknown) {
      if (err instanceof Error) log.warn('Login failed', err.message);
      else log.warn('Login failed');
    }
  };

  const handleGoogleSignIn = (): void => {
    // Implement Google Sign-In logic
    console.log('Google Sign-In clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="max-w-md w-full space-y-8">
        {/* Login Card */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-auto">
              <div className="text-2xl font-bold text-gray-900">Steerigo</div>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Login
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={validationErrors.email}
              required
              disabled={isLoading}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={validationErrors.password}
              required
              disabled={isLoading}
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/reset-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Sign in with Google
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an Account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Click here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
